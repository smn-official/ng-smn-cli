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