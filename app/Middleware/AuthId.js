'use strict'

class AuthId {
  async handle ({ request, auth, session }, next) {
    // call next to advance the request
    //global.authUserId = auth.user.id
    const user = await auth.getUser()
    global. authUserId = auth.user.id
    console.log(user.id)
  
    await next()
  }
}

module.exports = AuthId
