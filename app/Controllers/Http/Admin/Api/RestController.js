'use strict'

const inflect = require('i')()
const { validate } = use('Validator')
// class RestfulController {
class RestController {

  // create - POST /api/:resource
  async store({request, response}) {
    const model = new this.model
    let data 
    let form
    form = await this.formData()
    data = request.only(Object.keys(form.result.fields))
    data = this.filterData(data)
    model.fill(data)
    const validation = await validate(model.$attributes, model.rules, model.messages)
    if (validation.fails()) {
      //return validation.messages()
      response.status(200).json(this.restOk(true, 422,  validation.messages()[0].message))
      return
    }
    const result = await model.save()
    // console.log(result)
    response.json(this.restOk(true, 0, `created ${model.id}!`))
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
     console.log(request.input('page'),"===============")
     

     const  results  = await query.paginate(request.input('page', 1), request.input('perPage', 10))
  
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
    // console.log('show():result', result)
    response.json(this.restOk(result))
  }

  async validate(model, scenario,response) {
    //set different rules and messages for different `scenario`, such as 'create', 'update', 'changePassword' ...
    //see `get rules()` and `get messages()` in Model files
    model.scenario = scenario
    let messages = model.messages
    const valid = await validate(model.$attributes, model.rules, messages)
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
    delete model.$attributes.scenario
    const result = await model.save()
  
    response.json(this.restOk(true, 0, `created ${model.id}!`))
  }

  // update - PATCH /api/:resource/:id
  async update({request, response}) {
    let form, data
    form = await this.formData()
    data = request.only(Object.keys(form.result.fields))
    
    const model = await this.model.findOrFail(request.input('id'))
    data = this.filterData(data)
    model.fill(data)
    
    const validation = await validate(model.$attributes, model.rules, model.messages)
    if (validation.fails()) {
      console.log(request.input('id'))
      //return validation.messages()
      response.status(200).json(this.restOk(true, 422,  validation.messages()[0].message))
      return
    }
    let same  = 0
    for ( let key in model.$attributes) {
      if(model.$originalAttributes[key] != model.$attributes[key]) {
        same ++
      }
    }
    
    if(same === 0) {
      response.json(this.restOk(true, 422, `Because there is no change！`) )
      return
    }
    
    model.$attributes.id = request.input('id')
    const result = await model.save()
    response.json(this.restOk(true, 0, `updated ${model.id}!`) )

  }

  // delete - DELETE /api/:resource/:id
  async destroy({request, response}) {
    const model = this.model

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
  filterData(data) {
    for (let index in data) {
      if (Object.prototype.toString.call(data[index]) === '[object Array]') {
        data[index] = data[index].toString()
      }
    }
    return data
  }
}

// module.exports = RestfulController
module.exports = RestController