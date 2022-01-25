const pool = require('../db')

let Item = function(data) {
    this.data = data
    this.errors = []
}

Item.prototype.createItem = function() {
    const q = "INSERT INTO item(nome,descricao,valor,quantidade,observacoes,id_restaurante) values($1, $2, $3, $4, $5, $6)"

    const qValues = [this.data.nome ,this.data.descricao, this.data.valor, this.data.quantidade, this.data.observacoes, this.data.id_restaurante]
    return new Promise((resolve, reject) => {
        pool.query(q, qValues, (error, results) => {
            if (error) {
                reject(
                    "Erro ao inserir itens no banco de dados: " +
                    error
                )
            } else {
                resolve("Item criado com sucesso!!")
            }
        })
    })
}

Item.prototype.readAllbyIdRestaurante = function(){
    const q = "select i.id_item,i.nome,i.descricao,i.valor,i.quantidade,i.observacoes,i.id_restaurante from item as i left join restaurante as r on r.id_restaurante = i.id_restaurante where i.id_restaurante=$1 order by i.id_item desc;"
    const qValues = [this.data];
    return new Promise((resolve,reject)=>{
        pool.query(q, qValues, (error, results) => {
            if(error){
                reject("Algo deu errado ao recuperar os itens:"+error)
            }
            resolve(results.rows)
        })
    })

}

Item.prototype.readOneById = function(idItem) {
    const q = "select * from item where id_item = $1"
    const qValues = [idItem]

    return new Promise((resolve, reject) => {
        pool.query(q, qValues, (error, results) => {
            if (error) {
                reject("Erro ao recuperar item pelo id: " + error)
            } else {
                resolve(results.rows[0])
            }
        })
    })
}

Item.prototype.deleteItem = function(idRestaurante,idItem) {
    return new Promise(async(resolve, reject) => {
        try {
            const itemRecuperado = await this.readOneById(idItem)
            if (itemRecuperado.id_restaurante == idRestaurante) {
                const q = "DELETE FROM item i WHERE i.id_item = $1"
                const qValues = [idItem]
                pool.query(q, qValues, (error, results) => {
                    if (error) {
                        reject("Erro ao deletar item pelo id: " + error)
                    } else {
                        resolve("Item deletado com sucesso")
                    }
                })
            } else {
                reject("Não tem permissão para deletar o item")
            }
        } catch (error) {
            reject("Erro ao recuperar item para deletar pelo id: " + error)
        }
    })
}

Item.prototype.updateItem = function(idRestaurante,idItem) {
    return new Promise(async(resolve, reject) => {
        try {
            const itemRecuperado = await this.readOneById(idItem)
            if (itemRecuperado.id_restaurante == idRestaurante) {
                const q = "UPDATE item SET nome = $1, descricao = $2, valor = $3, quantidade = $4, observacoes = $5 WHERE item.id_item = $6;"
                const qValues = [this.data.nome,this.data.descricao,this.data.valor,this.data.quantidade,this.data.observacoes,idItem]
                pool.query(q, qValues, (error, results) => {
                    if (error) {
                        reject("Erro ao atualizar item pelo id:" + error)
                    } else {
                        resolve("Item atulizado com sucesso")
                    }
                })
            } else {
                reject("Não tem permissão para atualizar o item")
            }
        } catch (error) {
            reject("Erro ao recuperar item para atualizar pelo id: " + error)
        }
    })
}



module.exports = Item