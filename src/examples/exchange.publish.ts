import { Exchange, PUBLISH_DESTINATION } from '../Exchange';
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

  const exchange = new Exchange(channel, queueName, 'direct', {
    autoDelete: true,
  }, [{
    destinationType: PUBLISH_DESTINATION.QUEUE,
    pattern: queueName,
    destination: queueName
  }]);
  await exchange.init();

  await exchange.publish('test', queueName);

  await channelManager.destroy();
  await connectionManager.destroy();
})();
