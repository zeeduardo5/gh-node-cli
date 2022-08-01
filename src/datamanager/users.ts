import * as pgPromise from 'pg-promise';
import { QueryParam } from 'pg-promise';
import { User } from '../api/apiTypes';
import { compose } from '../helpers/compose';
import { closeDb, getDbConnection } from './dbConnection';
import {
  DbArgs, DbConnectFn, DbFn, DbLanguageFn,
  Filters,
  LanguageArgs, PgDb
} from './dbTypes';

async function dMInsertUser(user): Promise<User> {
  const insert: DbFn = async (args: DbArgs) => {
    const { db, data } = args;
    try {
      await db.none(
        'INSERT INTO ' +
        'users(id, name, login, location, public_repos, created_on) ' +
        'VALUES(' +
        '${data.id}, ${data.name}, ${data.login} , ' +
        '${data.location}, ${data.public_repos},current_timestamp) ' +
        'ON CONFLICT (id) ' +
        'DO UPDATE set location = ${data.location},' +
        'public_repos=${data.public_repos}'
        , {
          data,
        });
      return { data, db };
    } catch (e) {
      throw new Error(e);
    }
  }

  const insertLanguages: DbFn
    = async (args: DbArgs) => {
      const { db, data } = args;
      await Promise.all(Object.keys((data.languages))
        .map(async (lang: string) =>
          await insertLanguagesInDatabase(data.id, lang, db)))
      return args;
    }

  const insertLanguagesInDatabase: DbLanguageFn =
    async (userId: number, language: string, db: PgDb) => {
      const data: LanguageArgs = { userId, language };
      try {
        await db.none(
          'INSERT INTO languages(user_id, name) ' +
          'VALUES(${data.userId}, ${data.language})' +
          'ON CONFLICT (user_id, name) DO NOTHING'
          , {
            data,
          });
      } catch (e) {
        throw new Error(e);
      }
    }
  return await compose(closeDb, insertLanguages, insert, dbConnect)
  ({ data: user });
}

async function dMlistUsers(filters: Filters): Promise<User[]> {
  const listUsersFromDb: DbFn = async (args: DbArgs) => {
    const { db, filters } = args;
    let selectQuery: QueryParam = pgPromise({})
      .as.format('SELECT u.login, u.location, u.name, u.public_repos' +
        ' FROM users AS u');
    if (filters?.username) {
      selectQuery +=
        pgPromise({}).as.format(' WHERE u.login = $1', `${filters.username}`);
    } else if (filters?.location) {
      selectQuery +=
        pgPromise({}).
          as.format(' WHERE UPPER(u.location) = $1',
            `${filters.location.toUpperCase()}`);
    } else if (filters?.planguage) {

      selectQuery +=
        pgPromise({}).as.format(
          ' LEFT JOIN languages AS l ON u.id = l.user_id' +
          ' WHERE UPPER(l.name) = $1', `${filters.planguage.toUpperCase()}`);
    }
    try {
      const userList: User[] = await db.any(selectQuery);
      return { data: userList, db }
    } catch (e) {
      throw new Error(e);
    }
  }

  return await compose(closeDb, listUsersFromDb, dbConnect)({ filters });

}



const dbConnect: DbConnectFn = async (args: DbArgs) => {
  try {
    args.db = await getDbConnection();
    return args;
  } catch (e) {
    throw new Error(e);
  }
};

export { dMInsertUser, dMlistUsers }
