import { Connection } from './Connection';

export class ConnectionManager {
  private connections: {[key: string]: Connection} = {};

  public async getConnection(url: string): Promise<Connection> {
    if (!this.connections[url]) {
      this.connections[url] = new Connection(url);
      await this.connections[url].connect();
    }

    return this.connections[url];
  }

  public async destroy(): Promise<void> {
    for (const url in this.connections) {
      await this.connections[url].close();
    }
  }
}
