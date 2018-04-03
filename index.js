const commander = require('commander');
const devkit = require('./src/helpers/devkit');

const newCommander = require('./src/core/new/new.commander');

commander
    .version('1.0.0')
    .description('SMN Cli builds projects and cruds for Angular applications');

new newCommander();


commander.parse(process.argv);

