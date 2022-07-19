import axios from 'axios';
import { dMInsertUser, dMlistUsers } from '../datamanager/users';
import { compose } from '../helpers/compose'

async function fetchUserFromApi(username) {
  const getUser = async (username) => {
    try {
      const response =
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

  const getUserRepos = async (user) => {
    try {
      const response = await axios
        .get(process.env.API_URL + `/users/${user.login}/repos`,
          config(process.env.API_KEY));

      user.fullRepos = response.data.reduce((filtered, option) => {
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

  const repoLanguage = async (repoName) => {
    try {
      const response = await axios.
        get(process.env.API_URL + `/repos/${repoName}/languages`,
          config(process.env.API_KEY));

      return response.data;
    } catch (e) {
      throw new Error(e);
    }
  }

  const getLanguages = async (user) => {
    const languages = {};
    await Promise.all(user.fullRepos.map(async (repoName) => {
      const repoLanguages = await repoLanguage(repoName);
      Object.keys(repoLanguages).forEach((key) => {
        if (!languages[key]) {
          languages[key] = true;
        }
      });
    }))
    user.languages = languages;
    return user;
  }

  const insertUserInDb = async (user) => {
    await dMInsertUser(user);
    return user;
  };

  const userInDb = await dMlistUsers({ username });
  if (userInDb && userInDb.length > 0) {
    console.log(userInDb[0]);
  } else {
    const user = compose(
      insertUserInDb,
      getLanguages,
      getUserRepos,
      getUser)

    const { login, location, name, public_repos } = await user(username);

    console.log({ login, location, name, public_repos });
  }

}

async function listUsersFromDb(args) {
  console.log(await dMlistUsers(args));
}

const config = (key) => ({
  headers: { Authorization: 'token ' + key }
});

export { fetchUserFromApi, listUsersFromDb }