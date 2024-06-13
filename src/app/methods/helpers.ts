import { MockPythConnection } from '../constants';
import { Chains } from '../types';

export const getConnection = (_: Chains) => {
  let connection: any = MockPythConnection;

  // if (chain === Chains.Ethereum) {
  //   connection = PythConnection;
  // }

  return connection;
};
