'use strict'
const Model = use('Model')
class User extends Model {

  static boot() {
    super.boot()
    
    // this.addHook('beforeCreate', 'User.encryptPassword')
    // this.addHook('beforeCreate', 'User.generateUsername')
    // this.addHook('beforeCreate', 'User.generateNickname')
     this.addHook('beforeCreate', 'User.hashPassword')
     this.addHook('beforeCreate', 'User.CreateUid')
     this.addHook('beforeUpdate', 'User.hashPassword')
    //  this.addHook('beforeUpdate', 'User.generateAvatar')
  }

  static get hidden () {
    return ['password']
  }

  get rules() {
    const id = this.$originalAttributes.id
    let rules = {
        username: `required|unique:users,username,id,${id}`,
        nickname: `required|unique:users,nickname,id,${id}`,
        email: `required|email|unique:users,email,id,${id}`,
        password: 'required|min:6',
        password_confirmation: 'same:password',
        mobile: `required|unique:users,mobile,id,${id}`
      }
    if(id) {
      this.$originalAttributes.password ? rules['password'] = 'min:6' : delete rules['password'] 
    }  
    return rules
  }

  get messages() {
        return {
          'email.required': '请填写邮箱',
          'email.email': '邮箱好像不对呢',
          'email.unique': '邮箱已存在，试试登录？',
          'password.required': '密码密码',
          'password.min': '密码太短啦',
          'password.max': '密码太长',
          'password_confirmation.same': '重复密码有点问题',
          'username.required': '用户名可别忘了哦',
          'username.unique': '你来晚了，换个用户名吧',
          'nickname.required': '起个霸气的昵称吧',
          'nickname.unique': '你来晚了，换个昵称吧',
          'mobile.required': '手机号必填哦',
          'mobile.phone': '手机号码不正确',
          'mobile.unique': '手机号码已经存在'
      }
  }

  static get deleteTimestamp() {
    return 'deleted_at'
  }

  static get computed() {
    return ['fullname']
  }

  getFullname() {
    return this.nickname + ' @' + this.username
  }

  apiTokens() {
    return this.hasMany('App/Models/Token')
  }

  titles() {
    return this.belongsToMany('App/Models/Title', 'user_title', 'user_id', 'title_id')
  }



}

module.exports = User
