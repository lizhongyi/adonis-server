'use strict'

const Lucid = use('Lucid')

class Comment extends Lucid {

  static rules () {
    return {
      post_id: 'required',
      body: 'required',
      reply_id: 'integer'
    }
  }

  static get messages () {
    return {
      'post_id.required': '话题不见了',
      'reply_id.integer': '回复的评论呢',
      'body.required': '说点啥吧',
    }
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }
  user () {
    return this.belongsTo('App/Models/User')
  }
  reply () {
    return this.belongsTo('App/Models/Comment', 'id', 'reply_id')
  }

  replies () {
    return this.hasMany('App/Models/Comment', 'id', 'reply_id')
  }

}

module.exports = Comment
