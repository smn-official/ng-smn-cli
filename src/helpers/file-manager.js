const {exec} = require('child_process');
const fs = require('fs');

module.exports = {
    copy,
    read,
    create
};

/**
 * @description Copia um arquivo ou pasta para outro local, se for uma pasta e tiver aquivos dentro
 * todos eles serão copiados também
 * @param src - Caminho do arquivo ou pasta a ser copiado
 * @param dest - Local onde deve ser colado os arquivos copiados
 * @return Promise
 * **/
async function copy(src, dest) {
    return new Promise((resolve, reject) => {
        exec(`cp -r ${src} ${dest}`, err => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

/**
 * @description Lê um arquivo e converte o resultado para string
 * @param src - Caminho do arquivo a ser lido
 * @return Promise
 * **/
async function read(src) {
    return new Promise((resolve, reject) => {
        fs.readFile(src, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data.toString());
        });
    });
}

/**
 * @description Cria um arquivo
 * @param src - Caminho do arquivo a ser criado
 * @param content - Contéudo que será inserido no arquivo
 * @return Promise
 * **/
async function create(src, content) {
    return new Promise((resolve, reject) => {
        fs.appendFile(src, content, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}