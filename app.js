var express = require('express');

var pedidosRouter = require('./routes/pedidos');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/pedidos', pedidosRouter);

app.listen(3001, ()=> {
    console.log('Servidor rodando')
})
