import { Consumer } from '../Consumer';
import { InitConsumer } from '../Decorators';
import { AMQPConsumeMessage } from '../types';

const url: string = process.env['AMQP_URL'] || '';
const queueName = 'test';
const channelId = queueName;

@InitConsumer(
  url,
  {
    id: channelId,
    prefetch: 1
  },
  {
    name: queueName,
    queueOptions: {
      autoDelete: true
    }
  }
)
class TestConsumer extends Consumer {
  public async consume(msg: AMQPConsumeMessage | null) {
    console.log(msg?.content.toString());
  }
}

const testMessanger = new TestConsumer();
testMessanger.init().then(() => console.log('Consumer is initted'));
