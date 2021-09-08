import { ChannelManager } from '../managers/ChannelManager';
import { ConnectionManager } from '../managers/ConnectionManager';
import { Queue } from '../Queue';

const url: string = process.env['AMQP_URL'] || '';

const connectionManager = new ConnectionManager();
const channelManager = new ChannelManager();

(async () => {
  const connection = await connectionManager.getConnection(url);
  channelManager.setConnection(connection);
  const channel = await channelManager.getChannel();

  const queueName = 'test-managers';

  const queue = new Queue(channel, queueName, {
    autoDelete: true,
  });

  await queue.init();

  await channelManager.destroy();
  await connectionManager.destroy();
})();
