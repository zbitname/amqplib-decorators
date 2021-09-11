import {
  AMQPAssertQueue,
  AMQPChannel,
  AMQPConsume,
  AMQPConsumeMessage,
  IQueue,
} from '../types';

export class Queue implements IQueue {
  private initted = false;
  private initInProcessing = false;

  constructor(
    private channel: AMQPChannel,
    private name: string,
    private queueOptions: AMQPAssertQueue = {},
    private consumeOptions: AMQPConsume = {}
  ) {}

  async init(): Promise<void> {
    if (this.initted || this.initInProcessing) {
      return;
    }

    this.initInProcessing = true;

    await this.channel.assertQueue(this.name, this.queueOptions);
    this.initted = true;
    this.initInProcessing = false;
  }

  public consume(handler: (msg: AMQPConsumeMessage | null) => Promise<void>) {
    this.channel.consume(this.name, async (msg: AMQPConsumeMessage | null) => {
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
/*
  public async send<T>(message: T): Promise<void> {
    this.channel.sendToQueue(this.name, Buffer.from(JSON.stringify(message)));
  }
*/
  public async ack(msg: AMQPConsumeMessage) {
    this.channel.ack(msg);
  }

  public async nack(msg: AMQPConsumeMessage) {
    this.channel.nack(msg);
  }
}

