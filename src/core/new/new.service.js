const {exec, execSync} = require('child_process');
const Promise = require('bluebird');
const path = require('path');
const config = require('../../../config');
const InjectImports = require('../../helpers/inject-imports');
const Project = require('../../helpers/project');
const fileManager = require('../../helpers/file-manager');

module.exports = {
    newProject,
    installSMNUI,
    mkdir,
    generateErrorModules,
    generateSharedModule
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

            console.log('  Angular Cli finished your job');
            resolve();
        });
    });
}
/**
 * @description Cria um projeto em Angular Cli
 * @return Promise
 * **/
async function installSMNUI() {
    return new Promise((resolve, reject) => {
        console.log('  Installing SMN UI');
        exec(`cd ${Project.name} && npm install --save ng-smn-ui`, error => {
            if (error) {
                const customError = {
                    cause: `Error to create ${Project.name}`,
                    original: error
                };
                return reject(customError);
            }
            console.log('  SMN UI was install');
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
             path.join(config.url.project, 'src/app/core/shared'),
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
    return new Promise(async (resolve, reject) => {
        try {
            const dest = path.join(config.url.project, 'src/app/views');

            await fileManager.copy(path.join(config.url.helpers, 'modules/errors'), dest);

            const injectImports = new InjectImports(`${dest}/errors/error.module.ts`, 'ErrorModule');
            await injectImports.inject();
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}

/**
 * @description Cria o módulo de compartilhamento
 * @return Promise
 * **/
async function generateSharedModule() {
    return new Promise(async (resolve, reject) => {
        try {
            const dest = path.join(config.url.project, 'src/app/core/shared');
            await fileManager.copy(path.join(config.url.helpers, 'modules/shared.module.ts'), dest);

            const injectImports = new InjectImports(`${dest}/shared.module.ts`, 'SharedModule');
            await injectImports.inject();
            resolve();

        } catch (e) {
            reject(e);
        }

    });
}