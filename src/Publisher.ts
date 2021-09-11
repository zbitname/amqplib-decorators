import { Exchange } from './amqp/Exchange';
import { Connection } from './amqp/Connection';
import { getConnection } from './ConnectionFactory';
import {
  AMQPChannel,
  AMQPPublish,
  IChannelParams,
  IExchange,
  IExchangeParams,
} from './types';

export abstract class Publisher {
  private connection?: Connection;
  private channel?: AMQPChannel;
  private exchange?: IExchange;

  constructor(
    private connectionUrl: string,
    private channelParams: IChannelParams,
    private exchangeParams: IExchangeParams,
  ) {}

  public async init() {
    this.connection = await getConnection(this.connectionUrl);
    const channelManager = this.connection.getChannelManager();
    this.channel = await channelManager.getChannel(this.channelParams.id);

    this.exchange = new Exchange(
      this.channel,
      this.exchangeParams
    );
    await this.exchange.init();
  }

  public async publish(message: any, routingKey: string = '*', options: AMQPPublish = {}) {
    return this.exchange!.publish(message, routingKey, options);
  }
}
