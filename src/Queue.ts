import { Channel, ConsumeMessage, Options } from 'amqplib';

export class Queue {
  private initted = false;
  private initInProcessing = false;

  constructor(
    private channel: Channel,
    private name: string,
    private queueOptions: Options.AssertQueue = {},
    private consumeOptions: Options.Consume = {},
    private prefetch: number = 1
  ) {}

  async init(): Promise<void> {
    if (this.initted || this.initInProcessing) {
      return;
    }

    this.initInProcessing = true;

    if (this.prefetch) {
      this.channel.prefetch(this.prefetch);
    }

    await this.channel.assertQueue(this.name, this.queueOptions);
    this.initted = true;
    this.initInProcessing = false;
  }

  public consume(handler: (msg: ConsumeMessage | null) => Promise<void>) {
    this.channel.consume(this.name, async (msg: ConsumeMessage | null) => {
      if (!msg) {
        console.log('Empty message');
        return;
      }

      try {
        await handler(msg);
        await this.ack(msg);
      } catch (e) {
        console.error(e);
        await this.nack(msg);
      }
    }, this.consumeOptions);
  }

  public async send<T>(message: T): Promise<void> {
    this.channel.sendToQueue(this.name, Buffer.from(JSON.stringify(message)));
  }

  public async ack(msg: ConsumeMessage) {
    this.channel.ack(msg);
  }

  public async nack(msg: ConsumeMessage) {
    this.channel.nack(msg);
  }
}

