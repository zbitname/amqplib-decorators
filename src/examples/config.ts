import {
  IChannelParams,
  IExchangeParams,
  IQueueParams,
  PUBLISH_DESTINATION
} from '../types';

export const AMQP_URL: string = process.env['AMQP_URL'] || '';

interface IStrategy {
  url: string;
  channelParams: IChannelParams;
  queueParams?: IQueueParams;
  exchangeParams?: IExchangeParams;
}

const test1QueueParams = {
  name: 'test1',
  consumeOptions: {},
  queueOptions: {
    autoDelete: true,
  },
};

export const strategies = {
  test1: {
    url: AMQP_URL,
    channelParams: {
      id: test1QueueParams.name,
      prefetch: 1,
    },
    queueParams: test1QueueParams,
    exchangeParams: {
      name: test1QueueParams.name,
      type: 'direct',
      options: {
        autoDelete: true,
      },
      bindings: [{
        destination: test1QueueParams.name,
        destinationType: PUBLISH_DESTINATION.QUEUE,
        pattern: '*',
        queueParams: test1QueueParams,
      }],
    }
  } as IStrategy
};
