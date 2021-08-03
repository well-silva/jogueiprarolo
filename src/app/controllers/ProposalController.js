const mailer = require('../../lib/mailer')
const Proposal = require('../model/Proposal')
const User = require('../model/User')
const LoadProductService = require('../services/LoadProductService')

const email = (seller, product, buyer) => `
  <h2>Olá ${seller.name}</h2>
  <p>Você tem uma nova proposta no item</p>
  <div>
    <img src="${product.src}" />
    <p>Produto: ${product.name}</p>
    <p>Preço: ${product.formattedPrice}</p>
  </div>
  <br/><br/>
  <h3>Dados do comprador</h3>
  <p>Nome: ${buyer.name}</p>
  <p>E-mail: ${buyer.email}</p>
  <p>Endereço: ${buyer.address}</p>
  <p>CEP: ${buyer.cep}</p>
  <br/><br/>
  <p>Entre em contato com o comprador para finalizar a venda!</p>
  <br/><br/>
  <p>Atenciosamente, Equipe JogueiPraRolo</p>
`

module.exports = {
  async post (req, res) {
    let { valueProposal, phoneContact, message, cep, rua, bairro, cidade, estado, id } = req.body

    const product = await LoadProductService.load('product', {
      where: {
        id: req.body.id
      }
    })

    const seller = await User.findOne({
      where: {
        id: product.user_id
      }
    })

    const buyer = await User.findOne({
      where: {
        id: req.session.userId
      }
    })

    valueProposal = valueProposal.replace(/\D/g,"")
    cep = cep.replace(/\D/g, "")

    const proposalId = await Proposal.create({
      id_seller: seller.id,
      id_buyer: buyer.id,
      id_product: product.id,
      value_proposal: valueProposal,
      phone_contact: phoneContact,
      message,
      cep,
      rua,
      bairro,
      cidade,
      estado
    })

    await mailer.sendMail({
      to: seller.email,
      from: 'no-replay@jogueiprarolo.com.br',
      subject: 'Novo pedido de compra',
      html: email(seller, product, buyer)
    })
  
    return res.render('orders/success')

  },
  async proposalList(req, res) {
    const products = await LoadProductService.load('products', {
      where: { user_id: req.session.userId }
    })

    console.log(products)
    return res.render('user/proposal.njk', { products })
  }
}