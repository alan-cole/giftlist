# Gift List

Description coming soon.

## Todo

- Improve setup process [ Create test data from package.json / document setting up mongo db from command line ]

## Setting up you environment

* Install nodejs for [Ubuntu](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/).

(Optional)

* Install mongodb
* Create a local db and user in `mongo`

```js
use giftlist
db.createUser({
  user: "glserver",
  pwd: "password",
  roles: [{
    "role": "readWrite",
    "db":"giftlist"
  }]
})
```

## Installing

* Run `npm i` to install.

## Running api server

* Run `npm run start` to run server at localhost:3000.

## Front end application

The front end application is build in [Vue](https://vuejs.org/).

## Vue build Setup

``` bash
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
