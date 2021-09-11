import { AMQPChannel, AMQPConnection } from '../types';

export class ChannelManager {
  private channels: {[key: string]: AMQPChannel} = {};

  constructor(
    private connection?: AMQPConnection
  ) {}

  public setConnection(connection: AMQPConnection) {
    this.connection = connection;
  }

  public async getChannel(channelName = 'default'): Promise<AMQPChannel> {
    if (!this.connection) {
      throw new Error('Connection in not setted');
    }

    if (!this.channels[channelName]) {
      this.channels[channelName] = await this.connection.createChannel();
    }

    return this.channels[channelName];
  }

  public async destroy(): Promise<void> {
    for (const channelName in this.channels) {
      await this.channels[channelName].close();
    }
  }
}
