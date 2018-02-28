'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
npm*/

const { Ignitor } = require('@adonisjs/ignitor')
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
  const Antl = use('Antl')
  const inflect = require('i')()
  global.t = function (key, params) {
    //fallback
    if (Antl.get(key) === key) {
      return inflect.titleize(key.split('.').pop())
    }
    return Antl.formatMessage(key, params)
  }