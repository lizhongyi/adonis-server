'use strict'

const Lucid = use('Lucid')

class Page extends Lucid {
  type () {
    return this.belongsTo('App/Models/Type')
  }
}

module.exports = Page
