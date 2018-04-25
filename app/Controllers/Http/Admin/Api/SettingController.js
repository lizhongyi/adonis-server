'use strict'

const inflect = require('i')()
const Validator = use('Validator')

const Setting = use('App/Models/Setting')

class SettingController  {
  
  get model() {
    return Setting
  }

  async validate(model, scenario) {
    //set different rules and messages for different `scenario`, such as 'create', 'update', 'changePassword' ...
    //see `get rules()` and `get messages()` in Model files
    model.scenario = scenario
    let messages = Object.assign(t('validation'), model.messages)
    const valid = await Validator.validate(model.attributes, model.rules, messages)
    if (valid.fails()) {
      response.status(422).json(valid.messages())
    }
  }

  // update - PATCH /api/:resource/:id
  async update({ request, response }) {
    const model = await this.model.findOrFail(request.param('id'))
    await this.save(model, request, response)
  }

  async form ({ request, response }) {
    let rs = await this.model.all()
    let model = {} //or `code`, `name`
    let fields = {}
    let rules = {}
    let messages = {}
    
    for (let row of rs.toJSON()) {
      let {name: key, title: label,type, options, value} = row
      
      if (options) {
        options = JSON.parse(options)
      }
      
      model[key] = value
      fields[key] = {label, type, options}
    }

    let data = {
      model: model,
      fields: fields,
      rules: rules,
      messages: messages
    }

    response.json(data)
  }
}

module.exports = SettingController
