const {exec} = require('child_process');
const Promise = require('bluebird');
const path = require('path');
const config = require('../../../config');
const InjectImports = require('../../helpers/inject-imports');

module.exports = {
    newProject,
    mkdir,
    generateErrorModules
};
/**
 * @description Cria um projeto em Angular Cli
 * @param name - Nome do projeto
 * @return Promise
 * **/
async function newProject(name) {
    return new Promise((resolve, reject) => {
        exec(`ng new ${name} --style=scss --skip-install`, error => {
            if (error) {
                const customError = {
                    cause: `Error to create ${name}`,
                    original: error
                };
                return reject(customError);
            }

            resolve();
        });
    })
}

/**
 * @description Cria todas pastas necessárias para serem usadas pelos outros métodos
 * @param name - Nome do projeto
 * @return Promise
 * **/
async function mkdir(name) {
    return new Promise((resolve, reject) => {
        const dirs = [
             path.join(config.url.base, name, 'src/app/core/api'),
             path.join(config.url.base, name, 'src/app/core/utils/user'),
             path.join(config.url.base, name, 'src/app/views')
        ];

        exec(`mkdir ${dirs.join(' ')}`, error => {
            if (error) {
                const customError = {
                    cause: `Error to create dirs`,
                    original: error
                };

                return reject(customError);
            }

            resolve();
        });
    });
}

/**
 * @description Cria o módulo de erros
 * @param name - Nome do projeto
 * @return Promise
 * **/
async function generateErrorModules(name) {
    return new Promise(async (resolve) => {
        const dest = path.join(config.url.base, name, 'src/app/views');

        const injectImports = new InjectImports(`${dest}/errors/error.module.ts`, 'ErrorModule');
        await injectImports.inject();
        resolve();
    });
}