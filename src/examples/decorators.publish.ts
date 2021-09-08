import { ConsumeMessage, Options } from 'amqplib';
import { Messanger } from '../Messanger';
import { UseConnectionAndChannel, Consume } from './../Decorators';

const url: string = process.env['AMQP_URL'] || '';
const queueName = 'test';
const channelId = queueName;

@UseConnectionAndChannel(url, channelId)
class TestMessanger extends Messanger {
  @Consume({
    queue: queueName,
    queueOptions: {autoDelete: true},
    prefetchCount: 1,
  })
  /*
  public async onMessage(handler: (msg: ConsumeMessage | null) => Promise<void>) {
    const queue = await this.queueGetters.onMessage();

    queue.consume(handler);
  }
  */
  public async onMessage(msg: ConsumeMessage | null) {
    console.log(msg?.content.toString());
  }
}

@UseConnectionAndChannel(url, channelId)
class TestMessanger2 extends Messanger {
  public async onMessage2(msg: ConsumeMessage | null) {
    console.log(msg?.content.toString());
  }
}

(async () => {
  const testMessanger = new TestMessanger();
  await testMessanger.init();

  const testMessanger2 = new TestMessanger2();
  await testMessanger2.init();

  console.log(Messanger.test);
  console.log(TestMessanger.test);
  console.log(testMessanger.test);
  console.log(testMessanger2.test);
/*
  await testMessanger.onMessage(async (msg) => {
    console.log(msg?.content.toString());
  });
*/
})();
