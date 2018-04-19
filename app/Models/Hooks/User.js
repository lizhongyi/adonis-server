'use strict'

const Hash = use('Hash')
const UserHook = module.exports = {}

/**
 * Hash using password as a hook.
 *
 * @method
 *
 * @param  {Object} userInstance
 *
 * @return {void}
 */
UserHook.hashPassword = async (userInstance) => {
  if (userInstance.password) {
    console.log(userInstance.password)
    userInstance.password = await Hash.make(userInstance.password)
  }
}

UserHook.CreateUid = async (users) => {
  users.create_uid = authUserId
}