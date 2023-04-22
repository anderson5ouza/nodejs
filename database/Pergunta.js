const Sequelize = require('sequelize');
const connection = require('./database');

//estrutura da tabela a ser criada
const Pergunta = connection.define('pergunta', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//criando a tabela pergunta, caso ainda não exista
Pergunta.sync({force: false});

module.exports = Pergunta;