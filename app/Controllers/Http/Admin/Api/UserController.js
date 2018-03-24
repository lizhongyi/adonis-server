'use strict'
const RestController = require('./RestController')

const User = use('App/Models/User')

class UserController extends RestController {
 
  get resource() {
    return 'users'
  }

  get expand() {
    return null
  }

//   async store({ request, response}){
//     const User = use('App/Models/User')
//     const userData = request.only(['username', 'nickname', 'avatar','email','password'])

// // save and get instance back
//     const user = await User.create(userData)

//     return user
//   }
  async login ({ request, auth, session, response }) {
    let { username, password } = request.all()
    
    let token = null
    let user = null
    try {
      user = await auth.validate(username, password, true)
      token = await  auth.generate(user)
    } catch (e) {
      response.json({
        code: 1,
        message: 'Username or password is incorrect',
        result: null
      })
      return
    }

    response.json({
      user: user,
      token: token
    })
    
  }
  show ({ auth, params }) {
    
    return auth.user
  }

  async logout ({ request, auth, session }) {
    await auth.logout()
    session.clear()
    return 'logouted'
  }
  gridData () {
    console.log()
    return this.restOk({
      filters: {
        model: {
          username: '',
          created_at: ''
        },
        fields: {
          depart : { label:t('fields.user.depart'), type: 'select',choices:[{text:'部门',value:1}]},
          username: { label:t('fields.user.username') },
          nickname: { label:t('fields.user.nickname') },
          created_at: { label: t('fields.user.created_at'), type: 'date' }
        },
        rules: {},

      },
      columns: [
        { text: t('fields.user.id'), value: 'id' },
        { text: t('fields.user.username'), value: 'username'},
        { text: t('fields.user.nickname'), value: 'nickname'},
        { text: t('fields.user.mobile'), value: 'mobile' },
        { text: t('fields.user.created_at'), value: 'created_at', width: 180 },
      ],
      actions: {
        edit: true, delete: true
      },
      options: {
        sort: '-id', //or '-id' as desc
        create: false,
        update: true,
        delete: true
      },
    })
  }

  async formData (request, response) {
    const u = new User
    let model = {}
    let id
    if (request) {
      id = request.input('id')
      console.log(id)
      if (id) {
        model = await User.query().where('id', id).first()
        console.log(model)
      }
    }
   
    return this.restOk({
      
      model: model,
      open: 'window',
      fields: {
        username: { label: t('fields.user.username'), required: true },
        nickname: { label: t('fields.user.nickname'), required: true},
        avatar: {label: t('fields.user.avatar')},
        email:  {label: t('fields.user.email'),},
        password:  {label: t('fields.user.password')},
        mobile: {label: t('fields.user.mobile')},
      },
      rules: {
        username: `required`,
        nickname: `required`,
        email: 'required|email',
        password: id ? '' : 'required|min:6|max:10',
        mobile: 'required|phone'
      },
      messages: u.messages
    })
  }

   menu ({ request, response }) {
    response.send({code:0, data: {
      1: {
        href: '/',
        title: 'Home',
        icon: 'home'
      },
      2: {
        href: '/crud/posts',
        title: 'Posts',
        icon: 'view_list'
      },
      3: {
        href: '/crud/posts/create',
        title: 'Create Post',
        icon: 'note_add'
      },
      4: {
        href: '/crud/users',
        title: 'Users',
        icon: 'people'
      },
      5: {

        title: 'Pages',
        icon: 'domain',
        items: {
          6: {
            href: '/example',
            title: 'Example'
          },
          7: {
            href: '/about',
            title: 'About'
          },
          

        }
      },
      8: {
        href: '/login',
        icon: 'lock',
        title: 'Logout'
      },
    }})
  }
}

module.exports = UserController
