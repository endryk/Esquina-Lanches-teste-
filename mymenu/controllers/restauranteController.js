const Restaurante = require('../models/restaurante')

exports.home = function(req,res){
        res.render("pages/home.ejs") 
}

exports.saveRestaurante = function(req,res){
    dados = req.body
    let restaurante = new Restaurante(dados)
    restaurante.createRestaurante()
        .then(function(results) {
            res.render("pages/home.ejs")
        })
        .catch(function(error) {
            res.send("Não foi possível realizar o cadastrar do restaurante:" + error)
        })
}

exports.listRestaurantes = function(req,res){
    let restaurante = new Restaurante(null)
    restaurante.readAll()
    .then((results)=>{
        res.render("pages/restaurantes.ejs",{restaurantes:results})
    }).catch((error)=>{
        console.log("Algo deu errado ao tentar listar os restaurantes: " + error)
    })
    
}

exports.login =  function(req,res){
    dados = req.body
    let restaurante = new Restaurante(dados)
    restaurante.login()
        .then(function(results) {
            req.session.restaurante = results
            res.redirect("/")
        })
        .catch(function(error) {
            res.send(error)
        })
}

exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect("/")
    })
}
