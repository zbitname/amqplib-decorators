import { Consumer } from '../Consumer';
import { Publisher } from '../Publisher';
import { AMQPConsumeMessage } from '../types';
import { strategies } from './config';

const strategy = strategies.complex1;

class TestConsumer1 extends Consumer {
  public async consume(msg: AMQPConsumeMessage | null) {
    console.log(msg?.content.toString());
  }
}

const testConsumer1 = new TestConsumer1(
  strategy.url,
  strategy.channelParams,
  strategy.exchangeParams!.bindings![0].exchangeParams!.bindings![0].queueParams!,
);

class TestConsumer2 extends Consumer {
  public async consume(msg: AMQPConsumeMessage | null) {
    console.log(msg?.content.toString());
  }
}

const testConsumer2 = new TestConsumer2(
  strategy.url,
  strategy.channelParams,
  strategy.exchangeParams!.bindings![1].exchangeParams!.bindings![0].queueParams!,
);

class TestPublisher extends Publisher {}

const testPublisher = new TestPublisher(
  strategy.url,
  strategy.channelParams,
  strategy.exchangeParams!
);

(async () => {
  await testConsumer1.init();
  console.log('Consumer1 is initted');

  await testConsumer2.init();
  console.log('Consumer2 is initted');

  await testPublisher.init();
  console.log('Publisher is initted');

  setInterval(() => {
    testPublisher.publish({foo: 'bar', time: new Date()}, '*');
  }, 1000);
})();
