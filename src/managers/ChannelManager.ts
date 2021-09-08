import { Connection, Channel } from 'amqplib';

export class ChannelManager {
  private channels: {[key: string]: Channel} = {};

  constructor(
    private connection?: Connection
  ) {}

  public setConnection(connection: Connection) {
    this.connection = connection;
  }

  public async getChannel(channelName = 'default'): Promise<Channel> {
    if (!this.channels[channelName]) {
      this.channels[channelName] = await this.connection!.createChannel();
    }

    return this.channels[channelName];
  }

  public async destroy(): Promise<void> {
    for (const channelName in this.channels) {
      await this.channels[channelName].close();
    }
  }
}
