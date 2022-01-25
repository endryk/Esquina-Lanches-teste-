const pool = require('../db')
const bcrypt = require('bcrypt');
const saltRounds = 10;

let Restaurante = function(data) {
    this.data = data
    this.errors = []
}

Restaurante.prototype.createRestaurante = function() {
    console.log(this.data)
    const q = "INSERT INTO restaurante(email,username,nome,tipo,password) values($1, $2, $3, $4, $5)"

    let salt = bcrypt.genSaltSync(saltRounds)
    this.data.senha = bcrypt.hashSync(this.data.senha, salt)

    const qValues = [this.data.email, this.data.username, this.data.nome, this.data.tipo, this.data.senha]
    return new Promise((resolve, reject) => {
        pool.query(q, qValues, (error, results) => {
            if (error) {
                reject("Erro ao criar o restaurante: problema ao inserir no banco de dados: " + error)
            } else {
                resolve("Restaurante criado com sucesso!!")
            }
        })
    })
}

Restaurante.prototype.readOneByUsername = function() {
    const q = "SELECT * FROM restaurante WHERE username = $1"
    const qValues = [this.data.username]

    return new Promise((resolve, reject) => {
        pool.query(q, qValues, (error, results) => {
            if (error) {
                reject("Erro ao recuperar restaurante pelo username" + error)
            } else {
                resolve(results.rows[0])
            }
        })
    })
}

Restaurante.prototype.readAll = function() {
    const q = "SELECT * FROM restaurante"

    return new Promise((resolve, reject) => {
        pool.query(q,(error, results) => {
            if (error) {
                reject("Erro ao recuperar todos os estaurantes:" + error)
            } else {
                resolve(results.rows)
            }
        })
    })
}

Restaurante.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.readOneByUsername() 
            .then((restauranteRecuperado) => {
                if (restauranteRecuperado && bcrypt.compareSync(this.data.senha, restauranteRecuperado.password)) { 
                    resolve(restauranteRecuperado)
                } else {
                    reject("Dados de login não conferem")
                }
            })
            .catch((err) => {
                reject("Erro ao recuperar login" + err)
            })
    })
}


module.exports = Restaurante