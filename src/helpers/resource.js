const config = require('../../config');
const fs = require('fs');
const path = require('path');
const excludeFiles = ['shared.module.ts', 'app.route.module.ts'];
const fileManager = require('./file-manager');

class InjectionManger {
    async inject(path, closerModule) {
        this.fileData = await fileManager.read(closerModule);
        this.injectImport(InjectionManger.findRelativePath(closerModule, path));
        this.injectIn(this.getTypeInject());
        InjectionManger.writeInFile(closerModule, this.fileData);
    }

    injectImport(relativePath) {
        const content = `import { ${this.className} } from '${relativePath.replace('.ts', '')};`;
        const imports = this.fileData.match(/(^import\s*{.+}\s*from\s*'.+';)/gm);
        const fileDataList = this.fileData.split('\n');
        const position = fileDataList.indexOf(imports[imports.length - 1]) + 1;
        fileDataList.splice(position, 0, content);
        this.fileData = fileDataList.join('\n');
    }

    injectIn(where) {
        let regex = `(${where}:\\s*\\[)(.*\\s)*(?=])`;
        let occurrence = this.fileData.match(new RegExp(regex, 'gm'));
        if (occurrence && !occurrence.length) {
            //TODO: Custom error
            throw 'Não é um arquivo';
        }

        occurrence = occurrence[0].replace(/\t*\s*/g, '').replace('imports:[', '');
        let imports = occurrence.split(',').filter(importValue => importValue);

        imports.push(this.className);
        imports = imports.map(importValue => '"' + importValue + '"');

        let imported = JSON.stringify(JSON.parse('[' + imports.join(',') + ']'), undefined, 4);
        imported = imported.replace(/"/g, '').replace(']', '  ');

        regex = `(${where}:\\s*\\[)(.*\\s)*(?=])`;
        this.fileData = this.fileData.replace(new RegExp(regex, 'gm'), 'imports: ' + imported);
    }

    getTypeInject() {
        // TODO: Retornar o tipo do component, directive e crud
        switch (this.type) {
            case 'module':
                return 'imports';
        }
    }

    static findRelativePath(from, to) {
        from = path.join(path.dirname(from));
        to = path.join(to);

        //Verificando se o caminho de partida é relativo ao caminho a ser encontrado
        const start = to.indexOf(from) !== -1 ? './' : '';
        let relativePath = `${start}${path.relative(from, to)}`;
        relativePath = relativePath.replace(/[\\]/g, '/');

        return relativePath;
    }

    static writeInFile(src, content) {
        const file = fs.openSync(src, 'r+');
        const bufferedText = new Buffer(content);
        fs.writeSync(file, bufferedText, 0, bufferedText.length);
    }
}

class Resource extends InjectionManger {
    constructor(type, name) {
        super();
        this.name = name;
        super.type = this.type = type;
        super.className = this.className = this.name.capitalize() + this.type.capitalize();
        super.filename = this.filename = `${this.name}.${this.type}.ts`;
    }

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

    async inject(path) {
        await super.inject(path, this.findRelativeModule(path))
    }

}

module.exports = Resource;