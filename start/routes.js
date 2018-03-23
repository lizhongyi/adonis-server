'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
const Database = use('Database')
const User = use('App/Models/User')
const inflect = require('i')()

Route.get('/', ({ session, response }) => {
    //session.put('username', 'virk')
    if(!session.get('username')){
      return response.status(401).send({
        message: 'nologin',
        code: -1
      })
    } else {
      response.redirect('/print')
    }
  })
  
Route.get('/print', ({ session }) => {
    return JSON.parse(session.get('username'))
})

Route.get('/lo', 'UserController.index')
  .middleware(['auth'])

Route.post('admin/api/login', 'Admin/Api/UserController.login')
Route.get('/logout', 'UserController.logout')

Route
  .get('users/:id', 'UserController.show')
  .middleware(['auth'])

  Route.group('admin/api', function () {
	const prefix = 'Admin/Api/'
	const resources = ['posts', 'users', 'types', 'comments', 'settings', 'pages']

	Route.get('/menu', `${prefix}UserController.menu`).as('menu')
	// Route
  // .post('users', 'Admin/Api/UserController.store')
  // .validator('StoreUser')
	for (let k in resources) {
		let resource = resources[k]
		let className = inflect.classify(resource)
		Route.get(`/${resource}/grid`, `${prefix}${className}Controller.grid`)
    Route.get(`/${resource}/form`, `${prefix}${className}Controller.form`)
    Route.get(`/${resource}/:id`, `${prefix}${className}Controller.show`)
    Route.resource(`/${resource}`, `${prefix}${className}Controller`)
    Route.patch(`/${resource}/:id`, `${prefix}${className}Controller.update`)
    // .validator(new Map([
    //   [[`${resource}.store`], [`Store${className}`]],
    //   [[`${resource}.update`], [`Update${className}`]]
    // ]))
	}
 
	Route.get(`/:resource/grid`, `${prefix}RestController.grid`)
	Route.get(`/:resource/form`, `${prefix}RestController.form`)
  // Route.resource(`/:resource`, `${prefix}RestController`)

}).prefix('admin/api')
//.middleware(['auth'])