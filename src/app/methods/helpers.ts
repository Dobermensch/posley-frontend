import { MockPythConnection, PythConnection } from '../constants';
import { Chains } from '../types';

export const getConnection = (chain: Chains) => {
  let connection: any = MockPythConnection;

  if (chain === Chains.Ethereum) {
    connection = PythConnection;
  }

  return connection;
};
