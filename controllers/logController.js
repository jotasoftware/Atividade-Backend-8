const path = require('path');
const fs = require('fs');

const pathJoin = path.join(__dirname, '../logs/logs.log');

module.exports = {
    adicionar: (tipo, mensagem) => {
        const log = `[${new Date().toISOString()}] [${tipo.toUpperCase()}] ${mensagem}`;
        fs.appendFile(pathJoin, log, 'utf8', (err)=>{
            if(err){
                console.error('Erro ao escrever nas logs..')
            }
        })
    },

    addError: (mensagem) => {
        module.exports.adicionar('ERROR', mensagem);
    },
    addSuccess: (mensagem) => {
        module.exports.adicionar('SUCCESS', mensagem);
    },
}