const express = require('express')
const app = express()
const multer = require('multer')
const fs = require("fs")
require("./models/items.json");



const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage })
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('home'))

app.post('/', upload.single('myFile'), (req, res) => {
    console.log(req.body, req.file)
    res.send('ok')
})

const lerFileJason = () => {
    const conteudo = fs.readFileSync('./models/items.json', 'utf-8')
    return JSON.parse(conteudo)
}

const escreverFileEmJson = (conteudo) => {
    const escrevendoFile = JSON.stringify(conteudo)
    fs.writeFileSync('./models/items.json', escrevendoFile, 'utf-8')
}

app.get('/models', (req, res) => {
    const mensagem = lerFileJason()
    res.send(mensagem)
})
app.post('/models', (req, res) => {
    const { IDMENSAGEM, DDD, CELULAR, OPERADORA, HORARIO_ENVIO, MENSAGEM, IDBROKER } = req.body
    const conteudoAtual = lerFileJason()
    const id = Math.random().toString(32).substr(3, 11)
    conteudoAtual.push({ id, IDMENSAGEM, DDD, CELULAR, OPERADORA, HORARIO_ENVIO, MENSAGEM, IDBROKER })
    escreverFileEmJson(conteudoAtual)
    res.send(id, IDMENSAGEM, DDD, CELULAR, OPERADORA, HORARIO_ENVIO, MENSAGEM, IDBROKER)
})
app.put('/models:id', (req, res) => {
    const { id } = req.params

    const { IDMENSAGEM, DDD, CELULAR, OPERADORA, HORARIO_ENVIO, MENSAGEM, IDBROKER } = req.body

    const conteudoAtual = lerFileJason()
    const selecionarItem = conteudoAtual.findIndex((item) => item.id === id)

    const { id: newId, IDMENSAGEM: newIDMENSAGEM, DDD: newDDD, CELULAR: newCELULAR, OPERADORA: newOPERADORA, HORARIO_ENVIO: newHORARIO_ENVIO, MENSAGEM: newMENSAGEM, IDBROKER: newIDBROKER } = conteudoAtual[selecionarItem]
    const newObject = {
        id: newId,
        IDMENSAGEM: IDMENSAGEM ? IDMENSAGEM : newIDMENSAGEM,
        DDD: DDD ? DDD : newDDD,
        CELULAR: CELULAR ? CELULAR : newCELULAR,
        OPERADORA: OPERADORA ? OPERADORA : newOPERADORA,
        HORARIO_ENVIO: HORARIO_ENVIO ? HORARIO_ENVIO : newHORARIO_ENVIO,
        MENSAGEM: MENSAGEM ? MENSAGEM : newMENSAGEM,
        IDBROKER: IDBROKER ? IDBROKER : newIDBROKER,
    }
    conteudoAtual[selecionarItem] = newObject
    escreverFileEmJson(conteudoAtual)
    res.send(newObject)
})
app.delete('/models:id', (req, res) => {
    const { id } = req.params
    const conteudoAtual = lerFileJason()
    const selecionarItem = conteudoAtual.findIndex((item) => item.id === id)
    conteudoAtual.splice(selecionarItem, 1)
    escreverFileEmJson(conteudoAtual)
    res.send("deletado")
})



app.listen(3000, () => console.log('rodando'))