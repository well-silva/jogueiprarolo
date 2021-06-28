const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const User = require('../model/User')
const { hash } = require('bcryptjs')

module.exports = {
  loginForm(req, res) {
    return res.render('session/login')
  },
  login(req, res) {
    req.session.userId = req.user.id

    return res.redirect('/users')
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  forgotFrom(req, res) {
    return res.render('session/forgot-password')
  },
  async forgot(req, res) {
    try {
      const user = req.user
    
      const token =  crypto.randomBytes(20).toString("hex")
      console.log(token)

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      await mailer.sendMail({
        to: user.email,
        from:'no-replay@comprei.com.br',
        subject: 'Recuperacao de senha',
        html: `
          <h2>Esqueceu a senha?</h2>
          <p>Sem problemas, e so usar o link abaixo para recuperar sua senha!</p>
          <p>
            <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
              RECUPERAR SENHA
            </a>
          </p>
        `
      })

      return res.render('session/forgot-password', {
        success: `Verifique seu email`
      })

    } catch (error) {
        console.log(error)
        return res.render('session/forgot-password', {
          error: 'Algo ocorreu errado!'
        })
    }
  },
  resetForm(req, res) {
    return res.render("session/password-reset", { token: req.query.token })
  },
  async reset(req, res) {
    const user = req.user
    const { password, token } = req.body

    try {
      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      })

      return res.render('session/login', {
        user:req.body,
        token,
        success: 'Senha atualizada com sucesso!'
      })


    } catch (error) {
      console.error(error)
      return res.render('session/password-reset', {
        user: req.body,
        error: 'Algo ocorreu errado!'
      })
    }
  }
}