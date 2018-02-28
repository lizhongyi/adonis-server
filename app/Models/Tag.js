'use strict'

const Model = use("Model")

class Tag extends Model{
  posts () {
    return this.belongsToMany('App/Models/Post', 'post_tag', 'tag_id', 'post_id')
  }
}

module.exports = Tag
