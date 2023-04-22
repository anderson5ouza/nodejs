const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const PerguntaModel = require('./database/Pergunta');
const RespostaModel = require('./database/Resposta');

connection
    .authenticate()
    .then(() => {
        console.log('Conexão estabelecida com o database!');
    })
    .catch((error) => {
        console.log(error);
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req,res) => {

    PerguntaModel.findAll({
        raw: true, order:[
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        //console.log(perguntas);

        res.render('index', {
            perguntas: perguntas
        });

    });

});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

app.post('/salvar-pergunta', (req, res) => {
    
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    PerguntaModel.create({
        id: id,
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });

    //res.send(titulo+'- '+descricao);
});

app.get('/pergunta/:id?', (req, res) => {

    let id = req.params.id ? req.params.id : false;

    PerguntaModel.findOne({
        where: {
            id: id
        }
    }).then(pergunta => {

        if(pergunta != undefined){

            //buscar todas as respostas da pergunta
            RespostaModel.findAll({
                raw: true,
                where: {
                    perguntaId: id
                },
                order:[
                    ['id', 'DESC']
                ]

            }).then(respostas => {
                res.render('pergunta', { 
                    pergunta: pergunta, 
                    respostas: respostas 
                });
            });


            
        }else{
            res.redirect('/');
        }
    });
        
});

app.post('/salvar-resposta', (req, res) => {

    var perguntaId = req.body.perguntaId;
    var descricao  = req.body.descricao;

    RespostaModel.create({
        descricao: descricao,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('pergunta/'+perguntaId);
    });

});

app.listen('3000', ()=>{
    console.log('APP rodando!');
});