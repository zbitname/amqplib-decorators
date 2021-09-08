import { ConnectionManager } from './managers/ConnectionManager';
import { ChannelManager } from './managers/ChannelManager';

const connectionManager = new ConnectionManager();
const channelManagers: {[key: string]: ChannelManager} = {};

const getChannelForConnection = async (url: string, channelId: string) => {
  const connection = await connectionManager.getConnection(url);

  if (!channelManagers[url]) {
    channelManagers[url] = new ChannelManager(connection);
  }

  const channel = await channelManagers[url].getChannel(channelId);

  return channel;
};


