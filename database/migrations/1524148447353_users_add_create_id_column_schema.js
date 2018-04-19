'use strict'

const Schema = use('Schema')

class UsersAddCreateIdColumnSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('create_uid',10)
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.dropColumn('create_uid')
    })
  }
}

module.exports = UsersAddCreateIdColumnSchema
