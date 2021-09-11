import { Connection } from './amqp/Connection';
import { ConnectionManager } from './amqp/ConnectionManager';

const connectionManager = new ConnectionManager();

export const getConnection = async (url: string): Promise<Connection> => {
  return connectionManager.getConnection(url);
};
