import * as pgPromise from 'pg-promise';
import { compose } from '../helpers/compose';

async function dMInsertUser(user) {
  const insert = async (args) => {
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

  const insertLanguages = async (args) => {
    const { db, data } = args;
    await Promise.all(Object.keys((data.languages))
      .map(async (lang) => await insertLanguagesInDatabase(data.id, lang, db)))
    return args;
  }

  const insertLanguagesInDatabase = async (userId, language, db) => {
    const data = { userId, language };
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
  return await compose(closeDb, insertLanguages, insert, dbConnect)(user);
}

async function dMlistUsers(filter) {
  const listUsersFromDb = async (args) => {
    const { db, data } = args;

    let selectQuery = pgPromise({})
      .as.format('SELECT u.login, u.location, u.name, u.public_repos' +
        ' FROM users AS u');
    if (data?.username) {
      selectQuery +=
        pgPromise({}).as.format(' WHERE u.login = $1', `${data.username}`);
    } else if (data?.location) {
      selectQuery +=
        pgPromise({}).
          as.format(' WHERE UPPER(u.location = $1)',
            `${data.location.toUpperCase()}`);
    } else if (data?.planguage) {

      selectQuery +=
        pgPromise({}).as.format(
          ' LEFT JOIN languages AS l ON u.id = l.user_id' +
          ' WHERE UPPER(l.name) = $1', `${data.planguage.toUpperCase()}`);
    }
    try {
      const userList = await db.any(selectQuery);
      return { data: userList, db }
    } catch (e) {
      throw new Error(e);
    }
  }

  return await compose(closeDb, listUsersFromDb, dbConnect)(filter);

}



const dbConnect = async (data) => {
  try {
    const db = await getDbConnection();
    return { data, db }
  } catch (e) {
    throw new Error(e);
  }
};

const closeDb = async (args) => {
  const { db, data } = args;
  db.$pool.end();
  return data;
}

async function getDbConnection() {
  const databaseConfig = {
    "host": process.env.DB_HOST,
    "port": parseInt(process.env.DB_PORT),
    "database": process.env.DB_NAME,
    "user": process.env.DB_USER,
    "password": process.env.DB_PWD
  };

  try {
    const pgp = pgPromise({});
    const db = pgp(databaseConfig);
    return db;
  } catch (e) {
    throw new Error('Cannot connect to database :' + e);
  }
}

export { dMInsertUser, dMlistUsers }