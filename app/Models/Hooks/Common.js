'use strict'

const Common = exports = module.exports = {}

Common.fillUserId = function async (next) {
  // {this} belongs to model instance
  if (!this.user_id) {
    this.user_id = authUserId
  }
  await next
}
