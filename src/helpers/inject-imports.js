const fs = require('fs');
const path = require('path');

const config = require('../../config');
const fileManager = require('./file-manager');

class InjectImports {

    /**
     * @description Prepara toda a estrura da injeção das importações
     * @param _path - Caminho do arquivo que precisa ser injetado
     * @param className - Nome da classe do módulo a ser injetado
     * @return void
     * **/
    constructor(_path, className) {
        this.path = _path;
        this.class = className;
        this.module = this.closerModule(path.resolve(path.dirname(_path), '..'));

        const pathFormatted = this.formatPath(this.module, _path).replace('.ts', '');
        this.importPath = `import { ${className} } from '${pathFormatted}';`;
    }

    /**
     * @description Encontra a url relativa entre um aquivo e outro
     * @param from - Caminho de partida
     * @param to - Caminho a ser encontrado
     * @return string
     * **/
    formatPath(from, to) {
        from = path.join(path.dirname(from));
        to = path.join(to);

        //Verificando se o o caminho a de partida é relativo ao caminho a ser encontrado
        const start = to.indexOf(from) !== -1 ? './' : '';
        let relativePath = `${start}${path.relative(from, to)}`;
        relativePath = relativePath.replace(/[\\]/g, '/');

        return relativePath;
    }

    /**
     * @description Encontra o módulo mais próximo
     * @param _path - Caminho de partida que será encontrado
     * @return string
     * **/
    closerModule(_path) {
        _path = path.join(path.resolve(_path, '..'));

        if (_path.indexOf(config.url.base) === -1) {
            throw console.log('InjectImport: File not found!');
        }

        const file = path.join(_path, this.findFileModule(_path));

        if (file && fs.existsSync(file)) {
            return file;
        }

        return this.closerModule(_path);
    }

    /**
     * @description Encontra o arquivo do módulo em uma pasta
     * @param _path - Pasta a ser lida
     * @return string
     * **/
    findFileModule(_path) {
        let fileName;
        const files = fs.readdirSync(_path);

        files.map(file => {
            // Procurando por 'module' no nome do arquivo
            if (file.indexOf('module') !== -1) {
                fileName = file;
            }
        });

        return fileName;
    }

    /**
     * @description Substituí o conteúdo de um arquivo
     * @param src - Caminho do arquivo
     * @param content - Novo conteúdo a ser inserido no arquivo
     * @return void
     * **/
    writeInFile(src, content) {
        const file = fs.openSync(src, 'r+');
        const bufferedText = new Buffer(content);
        fs.writeSync(file, bufferedText, 0, bufferedText.length);
    }

    /**
     * @description Injeta no arquivo os imports
     * @return void
     * **/
    async inject() {
        let content = await fileManager.read(this.module);
        let contentList = content.split('\n');

        // Inserindo uma linha com o import na última linha do import
        contentList.splice(contentList.lasIndex('import ') + 1, 0, this.importPath);
        // Encontrando o onde a classe deve ser injetada
        const importsIndex = contentList.index(']', contentList.index('imports'));
        // Pegando o último módulo importado
        let lastImport = contentList[importsIndex - 1];
        // Indentando a nova classe
        const classWithIndention = lastImport.replace(/\w+/g, this.class);
        // Colando a vírgula no último módulo do import
        contentList[importsIndex - 1] += ',';
        // Inserindo o módulo nos imports
        contentList.splice(importsIndex, 0, classWithIndention);
        content = contentList.join('\n');

        this.writeInFile(this.module, content);
    }
}

module.exports = InjectImports;