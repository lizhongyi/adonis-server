'use strict'

class StoreUser {
  get rules () {
    return {
      username: 'required|email|unique:users',
      email: 		'required|email|max:50|unique:users:email',
      password: 'required|min:6'
    }
  }

  get messages () {
    return {
      required: '{{ field }} is required to register!',
      min: 			'{{ field }} is too short!',
      max:			'{{ field }} is too long!',
      unique:		'{{ field }} is used!',
      same :    'Password must match!'
    }
  }
}

module.exports = StoreUser