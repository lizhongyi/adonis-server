'use strict'
const RestController = require('./RestController')

const User = use('Model')

class UserController extends RestController {
 
  get resource() {
    return 'users'
  }

  get expand() {
    return null
  }
  async login ({ request, auth, session }) {
    const { username, password } = request.all()
    try {
      let token = await auth.attempt(username, password)
      session.put('username', JSON.stringify(token))
      return token

    } catch (e) {
      return e
    }
  }
  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return 'You cannot see someone else\'s profile'
    }
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
      }
    })
  }

  async formData ( request, response ) {

    let model = {}
    let id
    if (request) {
      id = request.input('id')
      if (id) {
        model = await User.query().where('id', id).first()
      }
    }

    return this.restOk({
      
      model: model,
      open: 'window',
      fields: {
        username: { label: t('fields.user.username'), required: true},
        nickname: { label: t('fields.user.nickname'), required: true},
        avatar: {label: t('fields.user.avatar')}
      },
      rules: model.rules,
      messages: model.messages
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
