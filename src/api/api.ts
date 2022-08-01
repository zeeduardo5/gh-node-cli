import axios, { AxiosResponse } from 'axios';
import { dMInsertUser, dMlistUsers } from '../datamanager/users';
import { compose } from '../helpers/compose'
import {
  GhFn,
  Languages,
  User,
  UserFn,
  RepoLanguageFn,
  Repository,
  AuthConfig
} from './apiTypes';


async function fetchUserFromApi(username): Promise<void> {
  const getUser: GhFn = async (username: string) => {
    try {
      const response: AxiosResponse =
        await axios.get(process.env.API_URL + `/users/${username}`,
          config(process.env.API_KEY));
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new Error('User not Found, please provide a valid user');
      } else {
        throw new Error(e);
      }
    }
  }

  const getUserRepos: GhFn = async (user: User) => {
    try {
      const response: AxiosResponse = await axios
        .get(process.env.API_URL + `/users/${user.login}/repos`,
          config(process.env.API_KEY));

      user.fullRepos = response.data
        .reduce((filtered: string[], option: Repository) => {
          if (!option.fork) {
            filtered.push(option.full_name);
          }
          return filtered;
        }, []);
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  const repoLanguage: RepoLanguageFn = async (repoName: string) => {
    try {
      const response: AxiosResponse = await axios.
        get(process.env.API_URL + `/repos/${repoName}/languages`,
          config(process.env.API_KEY));

      return response.data;
    } catch (e) {
      throw new Error(e);
    }
  }

  const getLanguages: GhFn = async (user: User) => {
    const languages: Languages = {};
    await Promise.all(user.fullRepos.map(async (repoName: string) => {
      const repoLanguages: Languages = await repoLanguage(repoName);
      Object.keys(repoLanguages).forEach((key: string) => {
        if (!languages[key]) {
          languages[key] = true;
        }
      });
    }))
    user.languages = languages;
    return user;
  }

  const insertUserInDb: UserFn = async (user: User) => {
    await dMInsertUser(user);
    return user;
  };

  const userInDb: User[] = await dMlistUsers({ username });

  if (userInDb && userInDb.length > 0) {
    console.info(userInDb[0]);
  } else {
    const user: User = await compose(
      insertUserInDb,
      getLanguages,
      getUserRepos,
      getUser)(username);

    console.info({
      login: user.login,
      location: user.location,
      name: user.name,
      public_repos: user.public_repos
    });
  }
}

async function listUsersFromDb(args): Promise<void> {
  console.info(await dMlistUsers(args));
}

const config: AuthConfig = (key: string) => ({
  headers: { Authorization: 'token ' + key }
});

export { fetchUserFromApi, listUsersFromDb }