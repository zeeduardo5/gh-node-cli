# gh-node-cli

GhNodecli is a command line interface to fetch the GitHub and then list the fetched users from a local database.

## Installation

Use the package manager [npm](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) to install the dependencies of the application.

```bash
npm install
```
## Database Migrations

This application requires a postgresql Database already created with name you choose. For more info visit [postgresql](https://www.postgresql.org/docs/current/sql-createdatabase.html). 

Once the database is created, please fill the database.json located in the project root folder file with database credentials
```json
{
    "dev": {
      "driver": "pg",
      "user": "postgres",
      "password": "<password>",
      "host": "<host>",
      "database": "<name>",
      "port": "<port>",
      "schema": "<schema>"
    },
    "sql-file" : true
  }
````


Use the script bellow in order to perform the two migrations needed

```bash
npm run migrate-up
```
Once the following message is shown, the application is ready to be used
```bash
[INFO] No migrations to run
[INFO] Done
```
## Environment Variables
It's mandatory the use of an .env file in the root folder for the environment variables.
```bash
API_URL = <GITHUB API URL>
API_KEY = <GITHUB API KEY>
DB_PWD =  <DATABASE PASSWORD>
DB_USER = <DATABASE USER>
DB_NAME = <DATABASE NAME>
DB_HOST = <DATABASE HOST>
DB_PORT = <DATABASE PORT>
```
## Build
This application needs to build in order to be used. To build execute the following script:
```bash
npm run build
```

## Usage
After the previous steps are done, we are ready to make the first test.
### Fetch an user
```bash
npm start -- fetch -u=<username>
```
or 
```bash
node ./dist/main.js fetch -u=<username>
```
It's possible to use -u or --username as the arguments. 

### List users From database
#### List All users
```bash
npm start -- list
```
or 
```bash
node ./dist/main.js list
```
#### List users by location
```bash
npm start -- list -l=<location>
```
or 
```bash
node ./dist/main.js list -l=<location>
```

#### List users by programming language
```bash
npm start -- list -p=<programming language>
```
or 
```bash
node ./dist/main.js list -p=<programming language>
```
It's possible to use -l or --location and -p or --language as the arguments. 
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)
