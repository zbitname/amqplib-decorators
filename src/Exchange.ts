import { Channel, Options } from 'amqplib';

import { generateRandomString } from './helpers';
import { TExchangeType, TSerializer } from './types';

export enum PUBLISH_DESTINATION {
  QUEUE = 'queue',
  EXCHANGE = 'exchange',
}

interface IBinding {
  destinationType: PUBLISH_DESTINATION;
  destination: string;
  pattern: string;
}

const exchangeIdChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateExchangeName = () => `ex.gen.${generateRandomString(exchangeIdChars, 8)}`;

export class Exchange {
  private serialize: TSerializer = (msg) => Buffer.from(JSON.stringify(msg));
  private asserted = false;
  private initted = false;
  private inprocess = false;

  constructor(
    private channel: Channel,
    private name: string = generateExchangeName(),
    private type: TExchangeType = 'direct',
    private options: Options.AssertExchange = {},
    private bindings: IBinding[] = [],
  ) {}

  public setSerializer(serializer: TSerializer) {
    this.serialize = serializer;
  }

  public async init() {
    if (this.asserted || this.inprocess) {
      return;
    }

    this.inprocess = true;
    await this.channel.assertExchange(this.name, this.type, this.options);

    for (const binding of this.bindings) {
      switch (binding.destinationType) {
        case PUBLISH_DESTINATION.QUEUE:
          await this.bindToQueue(binding.destination, binding.pattern);
          break;

        case PUBLISH_DESTINATION.EXCHANGE:
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

  public async bindToQueue(queueName: string, pattern = '*') {
    await this.channel.bindQueue(queueName, this.name, pattern);
  }

  public async bindToExchange(exchangeName: string, pattern = '*') {
    await this.channel.bindQueue(exchangeName, this.name, pattern);
  }

  public async publish(message: any, routingKey: string, options: Options.Publish = {}) {
    if (!this.initted) {
      await this.init();
    }

    this.channel.publish(this.name, routingKey, this.serialize(message), options);
  }
}
