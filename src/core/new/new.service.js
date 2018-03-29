const {exec} = require('child_process');
const Promise = require('bluebird');
const path = require('path');
const config = require('../../../config');

module.exports = {
    newProject,
    mkdir,
    generateErrorModules
};

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

async function mkdir(name) {
    return new Promise((resolve, reject) => {
        const dirs = [
             path.join(config.url.base, name, 'src/app/core/api'),
             path.join(config.url.base, name, 'src/app/core/utils/user'),
             path.join(config.url.base, name, 'src/app/views')
        ];

        exec(`mkdir -r ${dirs.join(' ')}`, error => {
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

function generateErrorModules(name) {
    return new Promise((resolve, reject) => {
        exec(`cp -r ${path.join(config.url.helpers, 'modules/errors')} ${path.join(config.url.base, name)}`, error => {
            if (error) {
                const customError = {
                    cause: `Error to generate errors modules`,
                    original: error
                };

                return reject(customError);
            }

            resolve();
        });
    })
}