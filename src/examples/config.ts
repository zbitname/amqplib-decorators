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

const simpleQueueParams = {
  name: 'test-simple',
  consumeOptions: {},
  queueOptions: {
    autoDelete: true,
  },
};

const complex1QueueParams1 = {
  name: 'qcomplex1',
  consumeOptions: {},
  queueOptions: {autoDelete: true},
};

const complex1QueueParams2 = {
  name: 'qcomplex2',
  consumeOptions: {},
  queueOptions: {autoDelete: true},
};

export const strategies = {
  simple: {
    url: AMQP_URL,
    channelParams: {
      id: simpleQueueParams.name,
      prefetch: 1,
    },
    queueParams: simpleQueueParams,
    exchangeParams: {
      name: simpleQueueParams.name,
      type: 'direct',
      options: {
        autoDelete: true,
      },
      bindings: [{
        destination: simpleQueueParams.name,
        destinationType: PUBLISH_DESTINATION.QUEUE,
        pattern: '*',
        queueParams: simpleQueueParams,
      }],
    }
  } as IStrategy,
  complex1: {
    url: AMQP_URL,
    channelParams: {
      id: 'ch1',
      prefetch: 10,
    },
    exchangeParams: {
      name: 'ecomplex1',
      options: {autoDelete: true},
      type: 'fanout',
      bindings: [{
        destinationType: PUBLISH_DESTINATION.EXCHANGE,
        destination: 'ecomplex1.ex2',
        pattern: '*',
        exchangeParams: {
          name: 'ecomplex1.ex2',
          options: {autoDelete: true},
          type: 'direct',
          bindings: [{
            destinationType: PUBLISH_DESTINATION.QUEUE,
            destination: complex1QueueParams1.name,
            pattern: '*',
            queueParams: complex1QueueParams1, // may be skipped
          }],
        }
      }, {
        destinationType: PUBLISH_DESTINATION.EXCHANGE,
        destination: 'ecomplex1.ex3',
        pattern: '*',
        exchangeParams: {
          name: 'ecomplex1.ex3',
          options: {autoDelete: true},
          type: 'direct',
          bindings: [{
            destinationType: PUBLISH_DESTINATION.QUEUE,
            destination: complex1QueueParams2.name,
            pattern: '*',
            queueParams: complex1QueueParams2, // may be skipped
          }],
        }
      }]
    }
  } as IStrategy,
};
