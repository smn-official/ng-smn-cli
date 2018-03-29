const commander = require('commander');

const newCommander = require('./src/core/new/new.commander');

commander
    .version('1.0.0')
    .description('SMN Cli builds projects and cruds for Angular applications');

newCommander();


commander.parse(process.argv);

