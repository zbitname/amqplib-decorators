import {
  AMQPChannel,
  AMQPConnection,
  AMQPConsumeMessage,
  IQueue,
  TChannelGetter,
  TConnectionGetter,
  TQueueGetter
} from './types';

export abstract class Consumer {
  public connectionUrl?: string;
  public connectionGetter?: TConnectionGetter;
  public connection?: AMQPConnection;

  public channelGetter?: TChannelGetter;
  public channel?: AMQPChannel;

  public queueName?: string;
  public queueGetter?: TQueueGetter;
  public queue?: IQueue;

  public async init() {
    if (!this.connectionGetter) {
      throw new Error('Consumer has no setuped connection.');
    }

    if (!this.channelGetter) {
      throw new Error('Consumer has no setuped channel.');
    }

    if (!this.queueGetter) {
      throw new Error('Consumer has no setuped queue.');
    }

    this.queue = await this.queueGetter();
    await this.queue.init();

    this.queue.consume(this.consume);
  }

  abstract consume(msg: AMQPConsumeMessage | null): any;
}
