const User =  require('../model/User')
const { compare } = require('bcryptjs')
const { reset } = require('../controllers/SessionController')

module.exports = {
  async login(req, res, next) {
    const { email, password } = req.body
  
    const user = await User.findOne({ where: { email } })
  
    if(!user) return res.render('session/login', {
      user: req.body,
      error: 'Usuario nao cadastrado'
    })
  
    const passed = await compare(password, user.password)

    if(!passed) return res.render('session/login', {
      user: req.body,
      error: 'Senha incorreta'
    })

    req.user = user
  
    next()
  },
  async forgot(req, res, next) {
    const { email } = req.body

    try {
      let user = await User.findOne({where: { email }})

      if(!user) return res.render('session/forgot-password', {
        user: req.body,
        error: 'E-mail não cadastrado'
      })

      req.user = user

      next()
    } catch (error) {
      console.log(error)
    }
  },
  async reset(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body
    
    //Verificacao se usuario e cadastrado
    const user = await User.findOne({ where: { email } })
    
    if(!user) return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Usuario nao cadastrado'
    })

    //Verificacao se senha confere
    if (password !== passwordRepeat ) return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Senhas nao correspondem'
    })

    //Verificacao se token confere
    if (token != user.reset_token) return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Token invalido, solicite uma nova recuperacao de senha!'
    })

    //Verificacao se token nao expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Token expirado! Por favor, solicite uma nova recuperacao de senha!!'
    })

    req.user = user
    next()
  }
}