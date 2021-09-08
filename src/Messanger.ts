import { Channel, Connection, ConsumeMessage, Options } from 'amqplib';
import { Exchange } from './Exchange';
import { Queue } from './Queue';

type TConnectionGetter = () => Promise<Connection>;
type TChannelGetter = (connection: Connection) => Promise<Channel>;
type TQueueGetter = () => Promise<Queue>;

export class Messanger {
  public test = '1';
  public connectionUrl?: string;
  public connection?: Connection;
  public connectionGetter!: TConnectionGetter;

  public channel?: Channel;
  public channelGetter!: TChannelGetter;

  public exchange?: Exchange
  public queues: {[key: string]: Queue} = {};
  public queueGetters: {[key: string]: TQueueGetter} = {};
  public consumingMethods: string[] = [];

  public setConnectionGetter(getter: TConnectionGetter) {
    console.log('#setConnectionGetter');
    this.connectionGetter = getter;
  }

  public setChannelGetter(getter: TChannelGetter) {
    console.log('#setChannelGetter');
    this.channelGetter = getter;
  }

  public setQueueGetterHook(queueName: string, getter: TQueueGetter) {
    console.log('this.queueGetters', this.queueGetters);
    this.queueGetters[queueName] = getter;
  }

  public async init() {
    if (!this.connectionGetter) {
      throw new Error('You can use @Connect decorator for setting connection getter.');
    }

    this.connection = await this.connectionGetter();
    this.channel = await this.channelGetter(this.connection);
  }
/*
  public consume(queueName: string, handler: (msg: ConsumeMessage | null) => Promise<void>) {
    this.getQueueByName(queueName).consume(handler);
  }

  public getQueueByName(name: string) {
    return this.queues[name];
  }
*/
}
