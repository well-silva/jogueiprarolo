const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')
const User =  require('../model/User')
const Product = require('../model/Product')
const LoadProductService = require('../services/LoadProductService')

const { formatCep, formatCpfCnpj } = require('../../lib/utils')

module.exports = {
  registerForm(req, res) {
    return res.render('user/register')
  },
  async show(req, res) {
    try {
      const { user } = req

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
      user.cep = formatCep(user.cep)
  
      return res.render('user/index', { user })

    } catch (error) {
      console.error(error);
    }
  },
  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj, cep, address } = req.body

      password = await hash(password, 8)
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      const userId = await User.create({
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address
      })

      req.session.userId = userId
  
      return res.redirect('/users')

    } catch (error) {
      console.error(error);
    }
  },
  async update(req, res) {
    try {
      const { user } = req

      let { name, email, cpf_cnpj, cep, address } = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      })

      return res.render('user/index', {
        user: req.body,
        success: 'Conta atualizada com sucesso'
      })
      
    } catch (error) {
      console.log(error)
      return res.render('user/index', {
        error: 'Algum erro aconteceu'
      })
    }
  },
  async delete(req, res) {
    try {
      const products = await Product.findAll({where: { user_id: req.body.id }})

      //Buscar todos os arquivo relacionado ao produto
      const allFilesPromise = products.map(product => 
        Product.files(product.id)
      )
      
      let promiseResults = await Promise.all(allFilesPromise)

      await User.delete(req.body.id)
      req.session.destroy()

      //Remover as imagens da pasta public
      promiseResults.map(files => {
        files.map(file => {
          try {
            unlinkSync(file.path)
          } catch (error) {
            console.error(error)
          }
        })
      })

      return res.render('session/login', {
        success: 'Conta deleta com sucesso!'
      })
      
    } catch (error) {
      console.error(error)
      return res.render('user/index', {
        user: req.body,
        error: "Erro ao tentar excluir sua conta!"
      })
    }
  },
  async ads(req, res) {
    const products = await LoadProductService.load('products', {
      where: { user_id: req.session.userId }
    })

    return res.render('user/ads.njk', { products })
  }
}