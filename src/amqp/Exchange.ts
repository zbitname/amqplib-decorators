import { Queue } from '../amqp/Queue';
import { generateRandomString } from '../helpers';
import {
  AMQPChannel,
  AMQPPublish,
  IExchange,
  IExchangeParams,
  PUBLISH_DESTINATION,
  TSerializer
} from '../types';

const exchangeIdChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateExchangeName = () => `ex.gen.${generateRandomString(exchangeIdChars, 8)}`;

export class Exchange implements IExchange {
  private serializer: TSerializer = (msg) => Buffer.from(JSON.stringify(msg));
  private asserted = false;
  private initted = false; // TODO
  private inprocess = false;

  constructor(
    private channel: AMQPChannel,
    private exchangeParams: IExchangeParams
  ) {}

  public setSerializer(serializer: TSerializer) {
    this.serializer = serializer;
  }

  public async init() {
    if (this.asserted || this.inprocess) {
      return;
    }

    this.inprocess = true;

    if (!this.exchangeParams.name) {
      this.exchangeParams.name = generateExchangeName(); // mutable
    }

    await this.channel.assertExchange(this.exchangeParams.name, this.exchangeParams.type, this.exchangeParams.options);

    for (const binding of this.exchangeParams.bindings!) {
      switch (binding.destinationType) {
        case PUBLISH_DESTINATION.QUEUE:
          await new Queue(this.channel, binding.queueParams!.name, binding.queueParams!.queueOptions).init();
          await this.bindToQueue(binding.destination, binding.pattern);
          break;

        case PUBLISH_DESTINATION.EXCHANGE:
          await new Exchange(this.channel, binding.exchangeParams!).init();
          await this.bindToExchange(binding.destination, binding.pattern);
          break;

        default:
          throw new Error('Unknown destination. Expected exchange or queue.');
      }
    }

    this.asserted = true;
    this.inprocess = false;
    this.initted = true;
  }

  public async bindToQueue(queueName: string, pattern = '*'): Promise<void> {
    await this.channel.bindQueue(queueName, this.exchangeParams.name, pattern);
  }

  public async bindToExchange(exchangeName: string, pattern = '*'): Promise<void> {
    await this.channel.bindQueue(exchangeName, this.exchangeParams.name, pattern);
  }

  public async publish(message: any, routingKey: string, options: AMQPPublish = {}): Promise<boolean> {
    return this.channel.publish(this.exchangeParams.name, routingKey, this.serializer(message), options);
  }
}
