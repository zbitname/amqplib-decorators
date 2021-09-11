import { connect } from 'amqplib';
import { ChannelManager } from '../amqp/ChannelManager';

import { AMQPConnection } from '../types';

export class Connection {
  private rawConnection?: AMQPConnection;
  private channelManager = new ChannelManager();

  constructor(
    public url: string
  ) {}

  public async connect() {
    if (!this.rawConnection) {
      this.rawConnection = await connect(this.url);
      this.channelManager.setConnection(this.rawConnection);
    }

    return this.rawConnection;
  }

  public async close() {
    await this.rawConnection?.close();
  }

  public getChannelManager() {
    return this.channelManager;
  }
}
