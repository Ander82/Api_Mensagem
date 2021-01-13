//Requerendo fs libary para streaming de arquivo no Node
let fs = require('fs');
let files = [];// Array criado para salvar temporariamente os arquivos
//Lendo todos os arquivos síncronos de arquivos de pasta e usando forEach para navegar pela matriz de arquivoss
fs.readdirSync('./uploads').forEach(file => {
    //Podemos usar o arquivo var do retorno de chamada, para ler o arquivo no parâmetro da função
    fs.readFile('./uploads/' + file, 'utf8', function (err, data) {
        //Imprimindo o resultado dos dados no terminal
        const files = data.split("!@#$")


    });
});

console.log(files)

const resultado = 'bff58d7b-8b4a-456a-b852-5a3e000c0e63;12;996958849;NEXTEL;21:24:03;sapien sapien non mi integer ac neque duis bibendum!@#$b7e2af69-ce52-4812-adf1-395c8875ad30;46;950816645;CLARO;19:05:21;justo lacinia eget tincidunt eget ';

const linhas = resultado.split("!@#$");
console.log(linhas)
const registros = formatarRegistros(linhas);

function fetch(url) {
    return  require('node-fetch')(url);
}

function formatarRegistros(registrosEmLinha) {
    let registrosFormatados = [];
    registrosEmLinha.forEach(formatarRegistro(registrosFormatados))
    return registrosFormatados;
}
console.log(registros)

function formatarRegistro(registrosFormatados) {
    return (value) => {
        let propriedadesRegistro = value.split(";");
        let ddd = propriedadesRegistro[1];
        let telefone = propriedadesRegistro[2];
        let data = propriedadesRegistro[4];
        let descricao = propriedadesRegistro[5];
        let idBroker = propriedadesRegistro[3];
        let registro = {
            id: propriedadesRegistro[0],
            ddd: validarDDD(ddd),
            telefone: validarTelefone(telefone),
            estaNablackList: teste(ddd + telefone),
            operadora: propriedadesRegistro[3],
            data: validarHora(data),
            descricao: limitarChar(descricao),
            idBroker:atribuirBrokers(idBroker)
        };
        registro.estaNablackList.then((value) => registro.estaNablackList = value);
        registrosFormatados.push(registro)

    }
}

async function verificaBlackList(telefone) {
    const response = await fetch(`https://front-test-pg.herokuapp.com/blacklist/${telefone}`);
    if (response.status === 200) {
        console.log("esta na black list")
    } else if (response.status === 404) {
        console.log("o numero nao esta na balcklist")
    }
    return response.json();

}

async function teste(telefone) {
   const resultadoApi = await verificaBlackList(telefone);
   console.log(resultadoApi)
   return resultadoApi
}
teste('41996958849')

function validarDDD(ddd) {
    const ehTamanhoValido = ddd.length === 2;
    const DDDsDeSP = ["11", "12", "13", "14", "15", "16", "17", "18", "19"];
    const ehDeSP = DDDsDeSP.includes(ddd);
    const ehValido = ehTamanhoValido && ddd !== "00" && ehDeSP;
    if (!ehValido) {
        console.log("DDD invalido: " + ddd)
    }
    return ddd;
}
function validarTelefone(telefone) {
    const ehTamnahoValido = telefone.length === 9;
    const comecaComNove = telefone[0] === "9";
    const ehNumeroValido = telefone[1] >= 7 && telefone[1] <= 9;
    const ehValido = ehTamnahoValido && comecaComNove && ehNumeroValido;
    if (!ehValido) {
        console.log("telefone invalido: " + telefone)
    }
    console.log(telefone)
    return telefone;
}
function validarHora(data) {
    let hora = '19:59'
    const dataSplit = hora.split('/');
    var time1 = dataSplit;
    var time2 = data;
    
    const date1 = new Date('2020-01-01 ' + time1);
    const date2 = new Date('2020-01-01 ' + time2);
    
    
    if (date1.getTime() === date2.getTime()) {
        console.log('Os horários são iguais');
    }
    else if (date1.getTime(data) > date2.getTime(dataSplit)) {
        console.log(time1 + ' data de Envio Abaixo do Limite' + time2);
    }
    else {
        console.log(time1 + ' data de Envio Acima do Limite ' + time2);
    }
}

function limitarChar(descricao){
    const quantidadeCaractere = descricao.length
    if(quantidadeCaractere >= 140){
        return "Mensagem Acima do Limite de Caracteres"
    }
    return descricao   
}
function deletarIguais(teste){
    const telefonesItem = teste
    const deletarIguais = telefonesItem.filter((elem, index, arr) => arr.index)
    const listaAtualizada=deletarIguais
    return listaAtualizada
}console.log(deletarIguais)

function atribuirBrokers(idBroker){
    idBroker = idBroker
    brokerDois= idBroker.localeCompare("VIVO" || "TIM" ||"NEXTEL")
      
    if(brokerDois === 0){
        return 2
    }else if(brokerDois === 0 ){
        brokerUm =  idBroker.localeCompare("CLARO" || "OI" ||"NEXTEL")
        return 1
              

    }else {
        return 3
    }      
    
    
    
}

