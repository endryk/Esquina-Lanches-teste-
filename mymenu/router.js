const express = require('express')
const router = express.Router()

const restauranteController = require('./controllers/restauranteController.js')
const itemController = require('./controllers/itemController')

var pedidos = []

router.get("/", restauranteController.home)

router.get("/cadastrar",(req,res)=>{
    res.render("pages/cadastrorestaurante.ejs")
})

router.get("/login",(req,res)=>{
    res.render("pages/login.ejs")
})

router.get("/cadastrar-item",(req,res)=>{
    res.render("pages/cadastraritem.ejs")
})

router.post("/logout", restauranteController.logout)


//restarutante
router.post('/salvarrestaurante', restauranteController.saveRestaurante)

router.post('/login', restauranteController.login)

router.post('/salvaritem', itemController.saveItem)

router.get('/meucardapio', itemController.getItemByRestauranteId)

router.get("/restaurantes", restauranteController.listRestaurantes)

router.get('/restaurantes/:id', itemController.getItemByRestauranteId2)

router.get('/deletaritem/:id', itemController.deletarItem)

router.get('/atualizaritem/:id', itemController.atualizarItem)
router.post('/atualizaritem', itemController.atualizarItemSave)




//pedido

router.post('/adicionar-item/:id_restaurante',(req,res)=>{
    pedidos.push(req.body)
    res.redirect(`/restaurantes/${req.params.id_restaurante}`)
})


router.get('/finalizar-pedido',(req,res)=>{
    let cliente = req.query

    let total = 0
    for (let pedido of pedidos) {
        total += pedido.valor * pedido.quantidade
    }

    total = Math.trunc(total * 100) / 100
    res.render('pages/conta.ejs',{pedidos,total,cliente})
    pedidos = []
})



module.exports = router