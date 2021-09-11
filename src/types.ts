import {
  Channel,
  Connection,
  ConsumeMessage,
  Options
} from 'amqplib';

export type AMQPConnection = Connection;
export type AMQPChannel = Channel;
export type AMQPConsumeMessage = ConsumeMessage;

export type AMQPAssertQueue = Options.AssertQueue;
export type AMQPConsume = Options.Consume;

export type TChannelGetter = (connection: AMQPConnection) => Promise<AMQPChannel>;
export type TConsumeHandler = (msg: AMQPConsumeMessage | null) => Promise<void>;
export type TConnectionGetter = () => Promise<AMQPConnection>;
export type TSerializer = (msg: any) => Buffer;
export type TExchangeType = 'direct' | 'topic' | 'headers' | 'fanout' | 'match';
export type TQueueGetter = () => Promise<IQueue>;

export interface IQueueParams {
  name: string,
  queueOptions?: Options.AssertQueue,
  consumeOptions?: Options.Consume
}

export interface IChannelParams {
  prefetch?: number;
}

export interface IQueue {
  ack(msg: AMQPConsumeMessage): Promise<void>;
  consume(handler: (msg: AMQPConsumeMessage | null) => Promise<void>): void;
  init(): Promise<void>;
  nack(msg: AMQPConsumeMessage): Promise<void>;
  // send<T>(message: T): Promise<void>
}
