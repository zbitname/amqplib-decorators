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
export type AMQPAssertExchange = Options.AssertExchange;
export type AMQPPublish = Options.Publish;

export type TChannelGetter = (connection: AMQPConnection) => Promise<AMQPChannel>;
export type TConsumeHandler = (msg: AMQPConsumeMessage | null) => Promise<void>;
export type TConnectionGetter = () => Promise<AMQPConnection>;
export type TSerializer = (msg: any) => Buffer;
export type TExchangeType = 'direct' | 'topic' | 'headers' | 'fanout' | 'match';
export type TQueueGetter = () => Promise<IQueue>;
export type TExchangeGetter = () => Promise<IExchange>;

export interface IQueueParams {
  name: string,
  queueOptions?: Options.AssertQueue,
  consumeOptions?: Options.Consume
}

export interface IChannelParams {
  id?: string;
  prefetch?: number;
}

export interface IQueue {
  ack(msg: AMQPConsumeMessage): Promise<void>;
  consume(handler: (msg: AMQPConsumeMessage | null) => Promise<void>): void;
  init(): Promise<void>;
  nack(msg: AMQPConsumeMessage): Promise<void>;
  // send<T>(message: T): Promise<void>
}

export interface IExchange {
  init(): Promise<void>;
  setSerializer(serializer: TSerializer): void;
  bindToQueue(queueName: string, pattern: string): Promise<void>
  bindToExchange(exchangeName: string, pattern: string): Promise<void>
  publish(message: any, routingKey: string, options: AMQPPublish): Promise<boolean>
}

export enum PUBLISH_DESTINATION {
  QUEUE = 'queue',
  EXCHANGE = 'exchange',
}

export interface IExchangeBinding {
  destination: string;
  destinationType: PUBLISH_DESTINATION;
  pattern: string;
  queueParams?: IQueueParams;
  exchangeParams?: IExchangeParams;
}

export interface IExchangeParams {
  bindings?: IExchangeBinding[];
  name: string;
  options: AMQPAssertExchange;
  type: TExchangeType;
}

export interface IConsumer {
  consume(msg: AMQPConsumeMessage | null): Promise<void>;
}
