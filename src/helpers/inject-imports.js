const fs = require('fs');
const path = require('path');

const config = require('../../config');
const fileManager = require('./file-manager');

class InjectImports {

    constructor(_path, className) {
        this.path = _path;
        this.class = className;
        this.module = this.closerModule(path.resolve(path.dirname(_path), '..'));

        const pathFormatted = this.formatPath(this.module, _path).replace('.ts', '');
        this.importPath = `import { ${className} } from '${pathFormatted}';`;
    }

    formatPath(from, to) {

        // Formatting paths
        from = path.join(path.dirname(from));
        to = path.join(to);

        const start = to.indexOf(from) !== -1 ? './' : '';
        let relativePath = `${start}${path.relative(from, to)}`;
        relativePath = relativePath.replace(/[\\]/g, '/');

        return relativePath;
    }

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

    findFileModule(_path) {
        let fileName;
        const files = fs.readdirSync(_path);

        files.map(file => {
            if (file.indexOf('module') !== -1) {
                fileName = file;
            }
        });

        return fileName;
    }

    writeInFile(src, content) {
        const file = fs.openSync(src, 'r+');
        const bufferedText = new Buffer(content);

        fs.writeSync(file, bufferedText, 0, bufferedText.length);
    }

    async inject() {
        let content = await fileManager.read(this.module);
        let contentList = content.split('\n');

        contentList.splice(contentList.lasIndex('import ') + 1, 0, this.importPath);

        const importsIndex = contentList.index(']', contentList.index('imports'));
        let lastImport = contentList[importsIndex - 1];
        const classWithIndention = lastImport.replace(/\w+/g, this.class);

        contentList[importsIndex - 1] += ',';
        contentList.splice(importsIndex, 0, classWithIndention);
        content = contentList.join('\n');

        this.writeInFile(this.module, content);
    }
}

module.exports = InjectImports;