import { connect, Connection } from 'amqplib';

export class ConnectionManager {
  private connections: {[key: string]: Connection} = {};

  public async getConnection(url: string): Promise<Connection> {
    if (!this.connections[url]) {
      this.connections[url] = await connect(url);
    }

    return this.connections[url];
  }

  public async destroy(): Promise<void> {
    for (const url in this.connections) {
      await this.connections[url].close();
    }
  }
}
