import { ChannelManager } from '../amqp/ChannelManager';
import { ConnectionManager } from '../amqp/ConnectionManager';
import { Queue } from '../amqp/Queue';
import { AMQP_URL } from './config';

const connectionManager = new ConnectionManager();
const channelManager = new ChannelManager();

(async () => {
  const connection = await connectionManager.getConnection(AMQP_URL);
  channelManager.setConnection(await connection.connect());
  const channel = await channelManager.getChannel();

  const queueName = 'test-managers';

  const queue = new Queue(channel, queueName, {
    autoDelete: true,
  });

  await queue.init();

  await channelManager.destroy();
  await connectionManager.destroy();
})();
