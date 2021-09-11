import { Publisher } from '../Publisher';
import { strategies } from './config';

const strategy = strategies.test1;

class TestPublisher extends Publisher {}

const testPublisher = new TestPublisher(
  strategy.url,
  strategy.channelParams,
  strategy.exchangeParams!
);

(async () => {
  await testPublisher.init();
  console.log('Publisher is initted');

  setInterval(() => {
    testPublisher.publish({foo: 'bar'});
  }, 1000);
})();
