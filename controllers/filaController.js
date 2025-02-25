const path = require('path');
const fs = require('fs');

const Log = require('./logController');

const pathJoin = path.join(__dirname, '../database/datapedidos.json');

const fila = {
    primeiro: null,
    ultimo: null,
}

module.exports = {
    novoNo: (pedidoId) => {
        const novoNo = {
            pedidoId,
            proximo: null,
        }
        if(!fila.primeiro){
            fila.primeiro = novoNo;
            fila.ultimo = novoNo;
            module.exports.mudarStatus(fila.primeiro.pedidoId, "preparando")
        }else{
            fila.ultimo.proximo = novoNo;
            fila.ultimo = novoNo
        }
    },
    tirarNo: () => {
        if(!fila.primeiro) return null;
        let no = fila.primeiro;
        fila.primeiro = fila.primeiro.proximo;
        if(!fila.primeiro) return fila.ultimo = null;
        module.exports.mudarStatus(fila.primeiro.pedidoId, "preparando")
    },

    mudarStatus: (id, mensagemStatus)=>{
        fs.readFile(pathJoin, 'utf8', async (err, data) =>{
            let todosPedidos = [];
            if (data){
                todosPedidos = JSON.parse(data);
            } 
            let pedidoId = await todosPedidos.find(p => p.id === parseInt(id));

            pedidoId.status = mensagemStatus;
            let stringJson = JSON.stringify(todosPedidos, null, 2);
            fs.writeFile(pathJoin, stringJson, 'utf8', (err)=>{
                if(err) return Log.addError('Erro ao mudar status do pedido ' + id);
                Log.addSuccess(`Status de ${mensagemStatus} atribuido ao pedido ${id}`);
                if(mensagemStatus === "preparando") {
                    module.exports.mudarStatus(id, "entregue");
                }else if(mensagemStatus==="entregue"){
                    module.exports.tirarNo();
                }
            })
        })
    }
}