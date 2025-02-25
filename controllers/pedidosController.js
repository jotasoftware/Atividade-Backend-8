const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;

const Log = require('./logController');
const Fila = require('./filaController');

const pathJoin = path.join(__dirname, '../database/datapedidos.json');

module.exports = {
    criar: (nome, descricao) => {
        if (!nome||!descricao) return Log.addError('Pedido não adicionado, sem nome/descrição');
        fs.readFile(pathJoin, 'utf8', (err, data) =>{
            if(err) return Log.addError('Erro ao adicionar o pedido');
            let todosPedidos = [];
            if (data){
                todosPedidos = JSON.parse(data);
                var id = module.exports.proximoId();
            } 
            let pedido = {
                id: id, 
                nome,
                descricao,
                status: 'pendente'
            }
            todosPedidos.push(pedido)
            let stringJson = JSON.stringify(todosPedidos, null, 2);
            fs.writeFile(pathJoin, stringJson, 'utf8', (err)=>{
                if(err) return Log.addError('Erro ao salvar o pedido ' + id);
                Log.addSuccess(`Pedido ${id} criado`);
            })
            Fila.novoNo(pedido.id)
        })
    },

    editar: (nome, descricao, id) => {
        if (!nome&&!descricao) return Log.addError(`Pedido ${id} não editado, sem nome e descrição`);
        fs.readFile(pathJoin, 'utf8', (err, data) =>{
            if(err) return Log.addError('Erro ao adicionar o pedido');
            let todosPedidos = [];
            if (data){
                todosPedidos = JSON.parse(data);
            } 
            const pedidoId = todosPedidos.find(p => p.id === parseInt(id));
            pedidoId.nome = (nome) ? nome : pedidoId.nome;
            pedidoId.descricao = (descricao) ? descricao : pedidoId.descricao;
            let stringJson = JSON.stringify(todosPedidos, null, 2);
            fs.writeFile(pathJoin, stringJson, 'utf8', (err)=>{
                if(err) return Log.addError('Erro ao editar o pedido ' + id);
                Log.addSuccess(`Pedido ${id} editado`);
            })
        })
    },

    listar: async ()=>{ //tive que usar o async pois nao retornava corretamente
        const data = await fsp.readFile(pathJoin, 'utf8')
        let todosPedidos = [];
        if (data){
            todosPedidos = JSON.parse(data);
            Log.addSuccess(`${todosPedidos.length} pedidos listados`);
            return todosPedidos;
        } 
        Log.addError('Erro ao listar pedidos');
        return [];
    },

    apagar: (id) => {
        fs.readFile(pathJoin, 'utf8', (err, data) =>{
            if(err) return Log.addError('Erro ao deletar o pedido');
            let todosPedidos = [];
            if (data){
                todosPedidos = JSON.parse(data);
            } 
            const pedidoIndex = todosPedidos.findIndex(p => p.id === parseInt(id));
            todosPedidos.splice(pedidoIndex, 1);
            let stringJson = JSON.stringify(todosPedidos, null, 2);
            fs.writeFile(pathJoin, stringJson, 'utf8', (err)=>{
                if(err) return Log.addError('Erro ao deletar o pedido ' + id);
                Log.addSuccess(`Pedido ${id} deletado`);
            })
        })
    },

    proximoId: () => {
        const data = fs.readFileSync(pathJoin, 'utf8');
        todosPedidos = [];
        if (data){
            todosPedidos = JSON.parse(data);
        }
        if(todosPedidos.length === 0) return 1;
        const maiorId = Math.max(...todosPedidos.map(p => p.id));
        return maiorId+1;
    }
}