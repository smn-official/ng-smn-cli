const {exec} = require('child_process');
const Promise = require('bluebird');
const path = require('path');
const config = require('../../../config');
const InjectImports = require('../../helpers/inject-imports');
const Project = require('../../helpers/project');

module.exports = {
    newProject,
    mkdir,
    generateErrorModules
};
/**
 * @description Cria um projeto em Angular Cli
 * @return Promise
 * **/
async function newProject() {
    return new Promise((resolve, reject) => {
        console.log('\n  Angular Cli is generating your project');
        exec(`ng new ${Project.name} --style=scss --skip-install`, error => {
            if (error) {
                const customError = {
                    cause: `Error to create ${Project.name}`,
                    original: error
                };
                return reject(customError);
            }

            console.log('\n  Angular Cli finished your job');
            resolve();
        });
    });
}

/**
 * @description Cria todas pastas necessárias para serem usadas pelos outros métodos
 * @return Promise
 * **/
async function mkdir() {
    return new Promise((resolve, reject) => {
        const dirs = [
             path.join(config.url.project, 'src/app/core/api'),
             path.join(config.url.project, 'src/app/core/utils/user'),
             path.join(config.url.project, 'src/app/views')
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
 * @return Promise
 * **/
async function generateErrorModules() {
    return new Promise(async (resolve) => {
        const dest = path.join(config.url.project, 'src/app/views');

        const injectImports = new InjectImports(`${dest}/errors/error.module.ts`, 'ErrorModule');
        await injectImports.inject();
        resolve();
    });
}