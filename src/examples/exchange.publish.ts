import { Exchange } from '../amqp/Exchange';
import { ChannelManager } from '../amqp/ChannelManager';
import { ConnectionManager } from '../amqp/ConnectionManager';
import { Queue } from '../amqp/Queue';
import { PUBLISH_DESTINATION } from '../types';
import { AMQP_URL } from './config';

const connectionManager = new ConnectionManager();
const channelManager = new ChannelManager();

(async () => {
  const connection = await connectionManager.getConnection(AMQP_URL);
  await connection.connect();

  channelManager.setConnection(await connection.connect());
  const channel = await channelManager.getChannel();

  const queueName = 'test-managers';

  const queue = new Queue(channel, queueName, {
    autoDelete: true,
  });
  await queue.init();

  const exchange = new Exchange(
    channel,
    {
      name: queueName,
      options: {
        autoDelete: true
      },
      type: 'direct',
      bindings: [{
        destinationType: PUBLISH_DESTINATION.QUEUE,
        pattern: queueName,
        destination: queueName
      }]
    },
  );
  await exchange.init();

  await exchange.publish('test', queueName);

  await channelManager.destroy();
  await connectionManager.destroy();
})();
