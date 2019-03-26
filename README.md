# Gift List

Description coming soon.

## Setting up you environment

* Install nodejs for [Ubuntu](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/).

## Connecting to the MongoDB database

* Add DEV database details to `/config/environments/development/database.json`
* Add PROD database details to `/config/environments/production/database.json`

## Running server

* Run `npm i` to install.
* Run `npm run start` to run server.

## ReactJS

The front end application is build in [React](https://reactjs.org/).

### Development

For development run `npm run dev` to use the react server.

### Production

* For production run `npm run build` to build the static react app to `/build`, and run `npm run start` to host.
