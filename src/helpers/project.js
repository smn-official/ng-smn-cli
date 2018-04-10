const config = require('../../config');
const path = require('path');
const fileManager = require('./file-manager');

let name;
let type;

const Project = {
    /**
     * @description Registra o nome do projeto
     * @param _name - Nome do projeto
     * @return void
     * **/
    set name(_name) {
        name = _name.toString();
        config.url.project = path.join(config.url.base, _name);
    },
    /**
     * @description Retorna o nome do projeto
     * @return string
     * **/
    get name() {
        return name;
    },
    /**
     * @description Registra o tipo do projeto
     * @param _type - Tipo do projeto (Package, Blank, Project SMN)
     * @return void
     * **/
    set type(_type) {
        type = _type.toString();
    },
    /**
     * @description Retorna o tipo do projeto
     * @return string
     * **/
    get type() {
        return type;
    },
    /**
     * @description Cria o arquivo(.smn-cli) de configuração do projeto
     * @return void
     * **/
    async createConfig() {
        const _path = path.join(config.url.helpers, config.template);
        let content = await fileManager.read(_path);

        content = content.replace('{{NAME}}', this.name);
        content = content.replace('{{TYPE}}', this.type);

        await fileManager.create(path.join(config.url.project, config.template), content);
        console.log(`  create ${ config.template }`);
    }
};

module.exports = Project;
