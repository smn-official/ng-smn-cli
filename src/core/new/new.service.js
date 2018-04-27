const {exec} = require('child_process');
const Promise = require('bluebird');
const Project = require('../../helpers/project');

module.exports = {
    newProject,
    installSMNUI,
    deleteProject
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
 * @description Deleta o projeto se ocorrer um erro na criação
 * @return Promise
 * **/
async function deleteProject() {
    return new Promise((resolve, reject) => {
        exec(`rm -rf ${Project.name}`, error => {
            if (error) {
                const customError = {
                    cause: `Error to delete ${Project.name}`,
                    original: error
                };
                return reject(customError);
            }
            resolve();
        });
    });
}