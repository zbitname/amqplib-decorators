import { Channel, Connection, ConsumeMessage, Options } from 'amqplib';

import { ConnectionManager } from './managers/ConnectionManager';
import { ChannelManager } from './managers/ChannelManager';
import { Queue } from './Queue';
import { Messanger } from './Messanger';

const connectionManager = new ConnectionManager();
const channelManagersByConnections: {[key: string]: ChannelManager} = {};
export function UseConnectionAndChannel(url: string, id?: string) {
  return (constructor: Function) => {
    if (!channelManagersByConnections[url]) {
      channelManagersByConnections[url] = new ChannelManager();
    }

    const channelManager = channelManagersByConnections[url];

    constructor.prototype.connectionUrl = url;
    constructor.prototype.setConnectionGetter(() => connectionManager.getConnection(url));
    constructor.prototype.setChannelGetter((connection: Connection) => {
      channelManager.setConnection(connection);
      return channelManager.getChannel(id);
    });
  };
}

interface IConsumeParams {
  queue: string,
  queueOptions?: Options.AssertQueue,
  consumeOptions?: Options.Consume,
  prefetchCount?: number
}

export function Consume(params: IConsumeParams) {
  return (
    target: Messanger,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    target.test = '2';
    return descriptor;
  };
}

/*
export function Consume(params: IConsumeParams) {
  return (
    target: Messanger,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
console.log(target.);
    descriptor.value = function (handler: (msg: ConsumeMessage | null) => Promise<void>) {
      const that = (this as Messanger);
      that.setQueueGetterHook(key as string, async () => {
        if (!that.channel) {
          throw new Error('Channel is not defined');
        }

        if (!that.queues[params.queue]) {
          that.queues[params.queue] = new Queue(
            that.channel,
            params.queue,
            params.queueOptions,
            params.consumeOptions,
            params.prefetchCount,
          );

          await that.queues[params.queue].init();
        }

        return that.queues[params.queue];
      });

      const result = originalMethod.apply(this, [handler]);
      return result;
    };

    return descriptor;
  };
}
*/
