const config = require('../../config');
const path = require('path');
const fileManager = require('./file-manager');

let name;
let type;
let apps;

const Project = {
    /**
     * @description Registra o nome do projeto
     * @param _name - Nome do projeto
     * @return void
     * **/
    set name(_name) {
        name = _name;
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
        type = _type;
    },
    /**
     * @description Retorna o tipo do projeto
     * @return string
     * **/
    get type() {
        return type;
    },
    /**
     * @description Registra os aplicativos que o projeto usa
     * @param _apps - Tipo do projeto (Package, Blank, Project SMN)
     * @return void
     * **/
    set apps(_apps) {
        apps = _apps || {
            auth: false,
            finance: false,
            calendar: false
        };
    },
    /**
     * @description Retorna os aplicativos que o projeto usa
     * @return string
     * **/
    get apps() {
        return apps;
    },
    /**
     * @description Cria o arquivo(.smn-cli) de configuração do projeto
     * @return void
     * **/
    set config(config) {
        this.name = config.name;
        this.type = config.type;
        this.apps = config.apps || {};
    },
    /**
     * @description Cria o arquivo(.smn-cli) de configuração do projeto
     * @return void
     * **/
    async createConfig() {
        const _path = path.join(config.url.helpers, config.template);
        let content = await fileManager.read(_path);

        content = content
            .replace('{{NAME}}', this.name)
            .replace('{{TYPE}}', this.type)
            .replace('{{AUTH}}', this.apps.auth)
            .replace('{{FINANCE}}', this.apps.finance)
            .replace('{{CALENDAR}}', this.apps.calendar);

        await fileManager.create(path.join(config.url.project, config.template), content);
        console.log(`  create ${ config.template }`);
    }
};

module.exports = Project;
