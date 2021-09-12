import { Consumer } from '../Consumer';
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
testConsumer.init().then(() => console.log('Consumer is initted'));
