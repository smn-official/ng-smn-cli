const {exec} = require('child_process');
const Promise = require('bluebird');
const path = require('path');
const config = require('../../../config');
const Resource = require('../../helpers/resource');
const fileManager = require('../../helpers/file-manager');

module.exports = {
    generate
};

async function generate() {
    await mkdir();
    await copyApiService();
    await generateSharedModule();
    await generateErrorModules();
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

        exec(`mkdir ${dirs.join(' ')}`, err => {
            if (err) {
                const customError = {
                    cause: `Error to create dirs`,
                    original: err
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
            const module = new Resource('module', 'error');
            await module.inject(`${dest}/errors/error.module.ts`);
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
            const dest = path.join(config.url.project, 'src/app');
            await fileManager.copy(path.join(config.url.helpers, 'modules/shared.module.ts'), dest);
            const module = new Resource('module', 'shared');
            await module.inject(`${dest}/shared.module.ts`);
            resolve();

        } catch (e) {
            reject(e);
        }

    });
}

async function copyApiService() {
    return new Promise(async (resolve, reject) => {
        try {
            const src = path.join(config.url.helpers, 'services/api.service.project.ts');
            const dest = path.join(config.url.project, 'src/app/core/api/api.service.ts');

            await fileManager.copy(src, dest);
            resolve();

        } catch (e) {
            reject(e);
        }

    });
}