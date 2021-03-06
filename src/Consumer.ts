import { Queue } from './amqp/Queue';
import { Connection } from './amqp/Connection';
import { getConnection } from './ConnectionFactory';
import {
  AMQPChannel,
  AMQPConsumeMessage,
  IChannelParams,
  IQueue,
  IQueueParams,
} from './types';

export abstract class Consumer {
  private connection?: Connection;
  private channel?: AMQPChannel;
  private queue?: IQueue;

  constructor(
    private connectionUrl: string,
    private channelParams: IChannelParams,
    private queueParams: IQueueParams,
  ) {}

  public async init() {
    this.connection = await getConnection(this.connectionUrl);
    const channelManager = this.connection.getChannelManager();
    this.channel = await channelManager.getChannel(this.channelParams.id);

    if (this.channelParams.prefetch) {
      this.channel.prefetch(this.channelParams.prefetch);
    }

    this.queue = new Queue(
      this.channel,
      this.queueParams.name,
      this.queueParams.queueOptions,
      this.queueParams.consumeOptions
    );
    await this.queue.init();

    this.queue.consume(this.consume);
  }

  abstract consume(msg: AMQPConsumeMessage | null): any;
}
