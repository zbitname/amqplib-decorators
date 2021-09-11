import { ConnectionManager } from './managers/ConnectionManager';
import { ChannelManager } from './managers/ChannelManager';
import { Consumer } from './Consumer';
import { Queue } from './Queue';
import { AMQPConnection, IChannelParams, IQueueParams } from './types';

const DEFAULT_CHANNEL_ID = 'default';

interface IChannel extends IChannelParams {
  id?: string;
}

const connectionManager = new ConnectionManager();
const channelManagersByConnections: {[connectionId: string]: {[channelId: string]: ChannelManager}} = {};

// class decorator
export function InitConsumer(url: string, channelParams: IChannel, queueParams: IQueueParams) {
  let queueCache: Queue | null = null;

  return (constructor: Function) => {
    if (!channelParams.id) {
      channelParams.id = DEFAULT_CHANNEL_ID;
    }

    if (!channelManagersByConnections[url]) {
      channelManagersByConnections[url] = {};
    }

    if (!channelManagersByConnections[url][channelParams.id]) {
      channelManagersByConnections[url][channelParams.id] = new ChannelManager();
    }

    const connectionGetter = () => connectionManager.getConnection(url);

    const channelGetter = async () => {
      const connection = await connectionGetter();
      const channelManager = channelManagersByConnections[url][channelParams.id || DEFAULT_CHANNEL_ID];
      channelManager.setConnection(connection);
      const ch = await channelManager.getChannel();

      if (channelParams.prefetch) {
        ch.prefetch(channelParams.prefetch);
      }

      return ch;
    };

    const queueGetter = async () => {
      const channel = await channelGetter();
      if (!queueCache) {
        queueCache = new Queue(
          channel,
          queueParams.name,
          queueParams.queueOptions,
          queueParams.consumeOptions
        );
      }

      return queueCache;
    };

    constructor.prototype.connectionUrl = url;
    constructor.prototype.connectionGetter = connectionGetter;
    constructor.prototype.channelGetter = channelGetter;
    constructor.prototype.queueGetter = queueGetter;
  };
}
