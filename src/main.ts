"use strict";
import * as dotenv from 'dotenv';
import * as yargs from 'yargs';
import { fetchUserFromApi, listUsersFromDb } from './api/api';
dotenv.config()


async function main() {
  yargs
    .command('fetch',
      'fetch a user by username and store it locally.', async (yargs) => {
        yargs.positional('username', {
          describe: 'Username to fetch',
          alias: 'u',
          type: 'string',
        }).demandOption('username');
      }, async (argv) => {
        try {
          await fetchUserFromApi(argv.username);
        } catch (e) {
          console.error(e.message);
          process.exit();
        }
      })
    .help('help')
    .command('list',
      'list users from database', async (yargs) => {
        yargs.option('location', {
          describe: 'Location to filter',
          alias: 'l',
          type: 'string',
        }).option('planguage', {
          describe: 'Programming language to filter',
          alias: 'p',
          type: 'string',
        })
      }, async (argv) => {
        try {
          await listUsersFromDb(argv);
        } catch (e) {
          console.error(e.message);
          process.exit();
        }
      })
    .demandCommand(1)
    .strict()
    .argv

}

main();



