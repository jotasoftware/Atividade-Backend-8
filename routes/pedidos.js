var express = require('express');
var router = express.Router();
const pedidosController = require('../controllers/pedidosController')

router.post('/criar', function(req, res) {
    pedidosController.criar(req.body.nome, req.body.descricao);
    res.json({mensagem: "Pedido adicionado"});
});

router.put('/editar/:id', function(req, res) {
    const { id } = req.params;
    pedidosController.editar(req.body.nome, req.body.descricao, id);
    res.json({mensagem: "Pedido editado"});
});

router.get('/listar', async function(req, res) {
    res.json({Pedidos: await pedidosController.listar()});
});

router.delete('/apagar/:id', function(req, res) {
    const { id } = req.params;
    pedidosController.apagar(id);
    res.json({mensagem: "Pedido apagado"});
});

module.exports = router;
