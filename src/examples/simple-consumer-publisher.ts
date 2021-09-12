import { Consumer } from '../Consumer';
import { Publisher } from '../Publisher';
import { AMQPConsumeMessage } from '../types';
import { strategies } from './config';

const strategy = strategies.simple;

class TestConsumer extends Consumer {
  public async consume(msg: AMQPConsumeMessage | null) {
    console.log(msg?.content.toString());
  }
}

const testConsumer = new TestConsumer(
  strategy.url,
  strategy.channelParams,
  strategy.queueParams!,
);

class TestPublisher extends Publisher {}

const testPublisher = new TestPublisher(
  strategy.url,
  strategy.channelParams,
  strategy.exchangeParams!
);

(async () => {
  await testConsumer.init();
  console.log('Consumer is initted');

  await testPublisher.init();
  console.log('Publisher is initted');

  setInterval(() => {
    testPublisher.publish({foo: 'bar'});
  }, 1000);
})();
