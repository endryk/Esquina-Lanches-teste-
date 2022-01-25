const Item = require('../models/item')

exports.home = function (req, res) {
    res.render("pages/home.ejs")
}

exports.saveItem = function (req, res) {
    dados = req.body
    let item = new Item(dados)
    item.createItem()
        .then(function (results) {
            res.render("pages/home.ejs")
        })
        .catch(function (error) {
            res.send("Erro ao salvar item: " + error)
        })
}

exports.getItemByRestauranteId = function (req, res) {
    console.log(req.session.restaurante.id_restaurante)
    let item = new Item(req.session.restaurante.id_restaurante)
    item.readAllbyIdRestaurante().then((items) => {
        console.log(items)
        res.render("pages/cardapio.ejs", { items })
    })
        .catch((error) => {
            res.send("Erro ao retornar os itens:" + error)
        })

}

exports.getItemByRestauranteId2 = function (req, res) {
    restauranteBuscando = req.params.id

    let item = new Item(restauranteBuscando)
    item.readAllbyIdRestaurante().then((items) => {
        res.render("pages/fazerPedido.ejs", { items })
    })
        .catch((error) => {
            res.send("Erro ao retornar os itens:" + error)
        })

}

exports.deletarItem = function (req, res) {
    let item = new Item(null)
    item.deleteItem(req.session.restaurante.id_restaurante, req.params.id)
        .then((result) => {
            res.redirect("/meucardapio")
        })
        .catch((erro) => {
            console.log(erro)
        })
}


exports.atualizarItem = function (req, res) {
    let item = new Item(null)
    item.readOneById(req.params.id).then((results) => {
        res.render('pages/modificarItem.ejs', { item: results })
    })
        .catch((error) => {
            console.log(error)
        })

}

exports.atualizarItemSave = function (req, res) {
    dados = req.body
    let item = new Item(dados)
    item.updateItem(req.session.restaurante.id_restaurante, dados.id_item)
        .then((results) => {
            res.redirect("/meucardapio");
        })
        .catch((error) => {
            res.send(error)
        })

}


