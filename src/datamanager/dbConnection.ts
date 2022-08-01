import * as pgPromise from 'pg-promise';
import { User } from '../api/apiTypes';
import { DbConfiguration, PgDb, Pgp } from './dbTypes';

async function getDbConnection(): Promise<PgDb> {
  const databaseConfig: DbConfiguration = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
  };

  try {
    const pgp: Pgp = pgPromise({});
    const db: PgDb = pgp(databaseConfig);
    return db;
  } catch (e) {
    throw new Error('Cannot connect to database :' + e);
  }
}

async function closeDb(args): Promise<User | User[]> {
  const { db, data } = args;
  db.$pool.end();
  return data;
}

export { closeDb, getDbConnection };
