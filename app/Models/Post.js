'use strict'
const Model = use('Model')
class Post extends Model{
  
  static boot () {
    super.boot()

      // this.addHook('beforeUpdate', 'Common.fillUserId')
      this.addHook('beforeCreate', 'Common.fillUserId')

  }
    rules () {
      const id = this.$originalAttributes.id
      return {
        type_id: 'required',
        title:`required`,
        title:`required|unique:posts,title,title,${id}`,
        body:'required'
      }
  }

    get messages () {
    return {
      'type_id.required': '类别要选一个哦',
      'title.required': '标题哪能忘记呢',
      'body.required': '多少还是写点内容吧',
    }
  }

  static scopeActive (builder) {
    builder.where('deleted_at', null)
  }

  static scopeMine (builder) {
    builder.where('user_id', authUserId)
  }

  static get deleteTimestamp () {
    return 'deleted_at'
  }

  tags () {
    return this.belongsToMany('App/Models/Tag', 'post_tag', 'post_id', 'tag_id')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  type () {
    return this.belongsTo('App/Models/Type')
  }

  comments () {
    return this.hasMany('App/Models/Comment')
  }


}

module.exports = Post