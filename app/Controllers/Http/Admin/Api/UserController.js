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

    return this.restOk({
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
    return this.restOk({
      filters: {
        model: {
          username: '',
          created_at: ''
        },
        fields: {
          depart : { label:t('fields.user.depart'), type: 'select',choices:[{text:'部门',value:1}]},
          username: { label:t('fields.user.username') },
          id: { label: 'id'},
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
        create: true,
        update: true,
        delete: true,
        open: 'window'
      },
    })
  }

  async formData (request, response) {
    const u = new User
    let model = {}
    let id
    if (request) {
      id = request.input('id')
      let where = {}
      if (id) {
        where.id = id
      }
      model = await User.query().where(where).first()
    }
   
    return this.restOk({
      
      model: model,
      open: 'page',
      fields: {
        username: { label: t('fields.user.username'), type:'text',required: true, disabled: true },
        sex: { label: 'sex', type: 'radios',choices:[{text:'男',value:1},{text:'女',value:2}] },
        interest: { label: 'Interest', type: 'checkboxes',value: [],choices:[{text:'吃饭',value:'吃饭'},{text:'唱歌',value:'唱歌'}] },
        nickname: { label: t('fields.user.nickname'), type:'text',required: true},
       // depart : { label:t('fields.user.depart'), type: 'select',choices:[{text:'部门',value:1}]},
        avatar: {label: t('fields.user.avatar'),type:'text'},
        email:  {label: t('fields.user.email'),type:'text'},
        // Spassword:  {label: t('fields.user.password'),type:'text'},
        mobile: {label: t('fields.user.mobile'),type:'text'},
        created_at: { label: t('fields.user.created_at'), type: 'date' }
        
      },
      rules: {
        username: `required`,
        nickname: `required`,
        email: 'required|email',
        //password: id ? '' : 'required|min:6|max:10',
        mobile: 'required|phone'
      },
      messages: u.messages
    })
  }

   menu ({ request, response }) {
    return this.restOk({code:0, data: {
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
            icon: 'add',
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
