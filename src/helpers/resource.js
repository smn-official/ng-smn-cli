const config = require('../../config');
const fs = require('fs');
const path = require('path');
const InjectionManager = require('./injection-manager');

const excludeFiles = ['shared.module.ts', 'app.route.module.ts'];

class Resource extends InjectionManager {
    /**
     * @constructor
     * @param {string} type - Tipo do recurso
     * @param {string} name - Nome da clasee
     * @returns {Resource}
     * */
    constructor(type, name) {
        super();
        this.name = name;
        super.type = this.type = type;
        super.className = this.className = this.name.capitalize() + this.type.capitalize();
        super.filename = this.filename = `${this.name}.${this.type}.ts`;
    }

    /**
     * Encontra o módulo mais próximo
     * @param {string} _path - Caminho de partida
     * @return {string}
     * */
    findRelativeModule(_path) {
        if (!_path.includes(config.url.base)) {
            throw console.log('InjectImport: File not found!');
        }
        if (fs.statSync(_path).isFile()) {
            _path = path.join(path.resolve(_path, '..'));
        }

        const file = path.join(_path, this.moduleExists(_path));

        if (file && fs.existsSync(file) && fs.statSync(file).isFile()) {
            return file;
        }

        _path = path.join(path.resolve(_path, '..'));

        return this.findRelativeModule(_path);
    }

    /**
     * Verifica se existe um módulo na pasta
     * @param {string} _path - Caminho da pasta a ser lida
     * @returns {string}
     * */
    moduleExists(_path) {
        let filename;
        const files = fs.readdirSync(_path);

        files.map(file => {
            // Procurando por 'module' no nome do arquivo
            if (file.includes('module') && !excludeFiles.includes(file) && !this.filename.includes(file)) {
                filename = file;
            }
        });
        
        return filename || '';
    }


    /**
     * Injeta o novo recurso na aplicação
     * @param {string} _path - Caminho do arquivo a ser injetado
     * @returns {void}
     * */
    async inject(_path) {
        await super.inject(_path, this.findRelativeModule(_path))
    }

}

module.exports = Resource;