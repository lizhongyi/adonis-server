'use strict'

const RestController = require('./RestController')

const Type = use('App/Models/Type')

class TypeController extends RestController {
  get resource() {
    return 'types'
  }

  get expand() {
    return null
  }


  async gridData() {

    return this.restOk({
      options: {
        sort: 'id',
        create: false,
        update: true,
        delete: false
      },
      // filters: false,
      filters: {
        model: {
          name: '',
          created_at: ''
        },
        fields: {
          name: { label: t('fields.type.name') },
          created_at: { label: t('fields.type.created_at'), type: 'date' }
        },
        rules: {},

      },
      columns: [
        { text: t('fields.type.id'), value: 'id' },
        { text: t('fields.type.name'), value: 'name'}
        
      ],
      actions: {
        edit: true, delete: true
      }
    })
  }

  async formData (request, response) {

    let model = {}
    let id
    if (request) {
      id = request.input('id')
      if (id) {
        model = await Type.query().where('id', id).first()
      }
    }

    return this.restOk({
      
      model: model,
      fields: {
        name: { label: t('fields.type.name'), required: true}
      },
      rules: model.rules,
      messages: model.messages
    })
  }

  
}

module.exports = TypeController
