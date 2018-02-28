'use strict'
const User = use('App/Models/User')
class UserController {
    async index ({ auth }) {
      try {
        await auth.check()
      } catch (error) {
        response.send('You are not logged in')
      }
        return 'nimabi'
    }
    async login ({ request, auth, session }) {
    const { username, password } = request.all()
    try {
      let token = await auth.attempt(username, password)
      session.put('username', JSON.stringify(token))
      return token

    } catch (e) {
      return e
    }
  }
  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return 'You cannot see someone else\'s profile'
    }
    return auth.user
  }

  async logout ({ request, auth, session }) {
    await auth.logout()
    session.clear()
    return 'logouted'
  }

  async profile ({ auth, session }) {
    try {
      return session.get('username')
    } catch (error) {
      response.send('You are not logged in')
    }
  }
}

module.exports = UserController
