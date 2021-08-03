const LoadProductService = require('../services/LoadProductService')

module.exports = {
	async index(req, res) {
		try {
			const allProducts = await LoadProductService.load('products')
			const products = allProducts
			.filter((product, index) => index > 2 ? false : true)

			const allGames = await LoadProductService.load('products', {
        where: {
          category_id: 1
        }
      })

			const games = allGames.filter((game, index) => index > 2 ? false : true)

			const allConsoles = await LoadProductService.load('products', {
        where: {
          category_id: 2
        }
      })

			const consoles = allConsoles.filter((console, index) => index > 2 ? false : true)

			return res.render("home/index", { products, games, consoles })

		} catch (error) {
			console.error(error)
		}
	}
}