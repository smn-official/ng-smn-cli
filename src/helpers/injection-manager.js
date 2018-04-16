const fs = require('fs');
const path = require('path');
const fileManager = require('./file-manager');

class InjectionManager {
    /**
     * Injeta um classe no módulo mais próximo
     * @async
     * @param {string} path = Caminho do arquivo a ser injetado
     * @param {string} closerModule - Caminho do módulo mais próximo
     * @returns {void}
     * */
    async inject(path, closerModule) {
        this.fileData = await fileManager.read(closerModule);
        this.injectImport(InjectionManager.findRelativePath(closerModule, path));
        this.injectIn(this.getTypeInject());
        InjectionManager.writeInFile(closerModule, this.fileData);
    }

    /**
     * Importa a classe no arquivo
     * @param {string} relativePath - Caminha relativo entre módulo e o arquivo que vai injetado
     * @returns {void}
     * */
    injectImport(relativePath) {
        const content = `import { ${this.className} } from '${relativePath.replace('.ts', '')};`;
        const imports = this.fileData.match(/(^import\s*{.+}\s*from\s*'.+';)/gm);
        const fileDataList = this.fileData.split('\n');
        const position = fileDataList.indexOf(imports[imports.length - 1]) + 1;
        fileDataList.splice(position, 0, content);
        this.fileData = fileDataList.join('\n');
    }

    /**
     * Injeta a classe na aplicação
     * @param {string} where - Onde a classe deve ser injetada
     * @returns {void}
     * */
    injectIn(where) {
        let regex = `(${where}:\\s*\\[)(.*\\s)*(?=])`;
        let occurrence = this.fileData.match(new RegExp(regex, 'gm'));
        if (occurrence && !occurrence.length) {
            //TODO: Custom error
            throw 'Não é um arquivo';
        }

        occurrence = occurrence[0].replace(/\t*\s*/g, '').replace(`${where}:[`, '');
        let imports = occurrence.split(',').filter(importValue => importValue);

        imports.push(this.className);
        imports = imports.map(importValue => '"' + importValue + '"');

        let imported = JSON.stringify(JSON.parse('[' + imports.join(',') + ']'), undefined, 4);
        imported = imported.replace(/"/g, '').replace(']', '  ');

        regex = `(${where}:\\s*\\[)(.*\\s)*(?=])`;
        this.fileData = this.fileData.replace(new RegExp(regex, 'gm'), `${where}: ${imported}`);
    }

    /**
     * Retorna onde deve ser injeto o novo módulo, component, etc
     * @returns {string}
     * **/
    getTypeInject() {
        // TODO: Retornar o tipo do component, directive e crud
        switch (this.type) {
            case 'module':
                return 'imports';
        }
    }

    /**
     * Encontra a url relativa entre um aquivo e outro
     * @static
     * @param {string} from - Caminho de partida
     * @param {string} to - Caminho a ser encontrado
     * @returns {string}
     * **/
    static findRelativePath(from, to) {
        from = path.join(path.dirname(from));
        to = path.join(to);

        //Verificando se o caminho de partida é relativo ao caminho a ser encontrado
        const start = to.indexOf(from) !== -1 ? './' : '';
        let relativePath = `${start}${path.relative(from, to)}`;
        relativePath = relativePath.replace(/[\\]/g, '/');

        return relativePath;
    }

    /**
     * Substituí o conteúdo de um arquivo
     * @static
     * @param {string} src - Caminho do arquivo
     * @param {string} content - Novo conteúdo a ser inserido no arquivo
     * @return void
     * **/
    static writeInFile(src, content) {
        const file = fs.openSync(src, 'r+');
        const bufferedText = new Buffer(content);
        fs.writeSync(file, bufferedText, 0, bufferedText.length);
    }
}

module.exports = InjectionManager;