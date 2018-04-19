'use strict'

const RestController = require('./RestController')

const Post = use('App/Models/Post')
const Type = use('App/Models/Type')

class PostController extends RestController {
  get resource() {
    return 'posts'
  }

  get expand() {
    return 'type'
  }

  async gridData() {
    // get tags list

    return this.restOk({
      
      filters: {
        model: {
          title: '',
          created_at: ''
        },
        fields: {
          title: { label: '标题' },
          created_at: { label: '创建时间', type: 'date' }
        },
        rules: {},

      },
      extra: 'type',
      columns: [
        { text: 'ID', value: 'id' },
        { text: '标题', value: 'title', left: true },
        { text: '类别', value: 'type.name', width: 100, sortable: false  },
        { text: '作者', value: 'user_id', width: 180 },
        { text: '创建时间', value: 'created_at', width: 180 },
        
      ],
      actions: {
        edit: true, delete: true
      },
      options: {
        sort: '-id', //or '-id' as desc
        create: true,
        update: true,
        delete: true,
        open: 'window'
      },
    })
  }

  async formData (request, response) {

    const post = new Post
    let model = {}
    let id
    if (request) {
      id = request.input('id')
      let where = {}
      if (id) {
        where.id = id
      }
      model = await Post.query().where(where).first()
    }

    let typeOptions = await Type.query().select('id','name').fetch()
    typeOptions = typeOptions.toJSON()
    for (let type of typeOptions) {
        type.text = type.name
        type.value = type.id
    }
    console.log(typeOptions)
    return this.restOk({
      model: model,
      open:'window',
      fields: {
        title: { label: '标题', hint: '标题必须填写', type:'text'},
        type_id: {
          label: '类别', type: 'select', options: typeOptions,
        },
        body: { label: '内容', type: 'text' ,required: true},
      },
      rules: {
        title: `required`,
        type_id: `required`,
        body: `required`
      },
      messages: post.messages
    })
  }

  async getType () {
    let typeOptions = await Type.query().select('id','name').fetch()
    typeOptions = typeOptions.toJSON()
    for (let type of typeOptions) {
        type.text = type.name
        type.value = type.id
    }
    return typeOptions
  }
}

module.exports = PostController
