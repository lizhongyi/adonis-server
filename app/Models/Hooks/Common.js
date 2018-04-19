'use strict'

const Common = exports = module.exports = {}

Common.fillUserId = async function (next) {
  // {this} belongs to model instance
    next.user_id =  authUserId
    await next
}
