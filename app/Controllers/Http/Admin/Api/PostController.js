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
        { text: '创建时间', value: 'created_at', width: 180 },
        
      ],
      actions: true
    })
  }

  async formData (request, response) {

    let model = {
      title: '',
      type_id: null,
      body: '',
    }
    let id
    if (request) {
      id = request.input('id')
      if (id) {
        model = await Post.query().where('id', id).first()
      }
    }

    let typeOptions = await Type.query().select('id','name').fetch()
    typeOptions = typeOptions.toJSON()
    for (let type of typeOptions) {
        type.text = type.name
        type.value = type.id
    }
    return this.restOk({
      model: model,
      fields: {
        title: { label: '标题', hint: '标题必须填写', required: true},
        type_id: {
          label: '类别', type: 'select', options: typeOptions, required: true,
        },
        body: { label: '内容', type: 'html' ,required: true},
      },
      rules: model.rules,
      messages: model.messages
    })
  }
}

module.exports = PostController
