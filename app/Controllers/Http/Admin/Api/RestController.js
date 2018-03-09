'use strict'

const inflect = require('i')()
const { validate } = use('Validator')
// class RestfulController {
class RestController {

  // create - POST /api/:resource
  async store({request, response}) {
    const model = new this.model
    await this.save(model, request, response)
  }
  
  // readMany - GET /api/:resource
  async index({request, response}) {
    const model = this.model
    let query = model.query()
    let where = JSON.parse(request.input('query'))
    let expand = request.input('expand', this.expand)
    let sort = request.input('sort', '-id')
    // console.log(where)
    let conditions = []
    where.deleted_at = null
    console.log(where)
    let tableName = inflect.pluralize(this.resource)
    for (let k in where) {
      const v = where[k]
      if (v === '') {
        continue
      }
      if (typeof v === 'string') {
        query.where(tableName + '.' + k, 'like', `%${v}%`)
      }
      
      if ( v == null) {
        query.where(tableName + '.' + k, 'is', null)
      }

      console.log(k, v)
    }
    
   // console.log('query():expand', expand)
    if (expand) {
      // query.select(['posts.body as post_body'])
      query.with(expand)
      for (let k in expand){
        const expandTableName = inflect.pluralize(expand[k]) //types
        const expandFieldName = `${inflect.singularize(expandTableName)}_id` //type_id
        // query.join(expandTableName, `${expandTableName}.id`, `${tableName}.${expandFieldName}`)
      }
      
    }
    if (sort){
      let sortData = sort.split('-')
      let desc = sortData.length > 1
      let sortField = sortData.pop()

      if (sortField.indexOf('.') < 0) {
        sortField = sortField
      }
     // console.log('sort: ', sortField, desc)
      query.orderBy(sortField, desc ? 'desc' : 'asc')
      
    }

     const  results  = await query.paginate(request.input('page', 1), request.input('per_page', 10))
  
     response.json(this.restOk(results))
  }

  // readOne - GET /api/:resource/:id
  async show({request, response}) {
    
    const model = this.model
    const query = model.query().where({ id: request.param('id') })

    const expand = request.input('expand')
   // console.log('show():expand', expand)
    if (expand) {
      query.with(expand)
    }

    const result = await query.first()
    console.log('show():result', result)
    response.json(this.restOk(result))
  }

  async validate(model, scenario,response) {
    //set different rules and messages for different `scenario`, such as 'create', 'update', 'changePassword' ...
    //see `get rules()` and `get messages()` in Model files
    model.scenario = scenario
    let messages = model.messages
    const valid = await validate(model.attributes, model.rules, messages)
    if (valid.fails()) {
      response.status(422).json(valid.messages())
    }
  }

  async save(model, request, response) {
    let data = request.all()
    let form
      //fill fields defined in `this.formData()` only
    if (form = await this.formData()) {
      data = request.only(Object.keys(form.result.fields))
    }
    model.fill(data)
    const { validate } = use('Validator')
    const validation = await validate(data, model.rules)

    if (validation.fails()) {
      return validation.messages()
    }
    const result = await model.save()
    console.log(result)
    response.json(this.restOk(true, 0, `created ${model.id}!`))
  }

  // update - PATCH /api/:resource/:id
  async update({request, response}) {
    const model = await this.model.findOrFail(request.param('id'))
    await this.save(model, request, response)
  }

  // delete - DELETE /api/:resource/:id
  async destroy({request, response}) {
    const model = this.model
    console.log(request.params.id)
    const record = await model.find(request.params.id)
    // const result = await record.delete()
    const result = await model
      .query()
      .where('id', request.params.id)
      .update({ deleted_at: '2018-02-04 12:14:24' })
    if(result) {
      response.json(this.restOk(true,0,'this resoure id=' + request.params.id + ' is  deleted!'))
    }
  }

  async grid({request, response}) {
    response.json(await this.gridData())
  }

  async form({request, response}) {
    response.json(await this.formData(request, response))
  }

  get resource() {
    const request = global.request
    return request.param('resource')
  }

  get model() {
    const model = use('App/Models/' + inflect.classify(this.resource))
    return model
  }

  get gridColumns() {
    
    return global.request.input('fields', 'id').split(',')
  }
  get formFields() {
    return global.request.input('fields', '').split(',')
  }

  async gridData() {
    const singular = inflect.singularize(this.resource)
    return {
      columns: this.gridColumns.map(field => ({ text: t(`fields.${singular}.${field}`), value: field })),
      actions: true
    }
  }

  async formData(request, response) {
    const singular = inflect.singularize(this.resource)

    let model = {}
    let id
    if (request) {
      id = request.input('id')
      if (id) {
        model = await this.model.query().where('id', id).first()
      }
    }
    let fields = {}
    this.formFields.map(field => {
      fields[field] = { label: t(`fields.${singular}.${field}`) }
    })
    return {

      model: model,
      fields: fields,
      rules: this.model.rules,
      messages: this.model.messages
    }
  } 
  restOk(json, code=0, messages=null){
    return {
      code: code,
      messages: messages,
      result: json
    }
  }
}

// module.exports = RestfulController
module.exports = RestController