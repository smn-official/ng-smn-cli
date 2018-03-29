const commander = require('commander');
const service = require('./new.service');

module.exports = start;

function start() {
    commander
        .command('new <name>')
        .option('-b, --blank', 'Make a clear project')
        .option('-p, --package', 'Make project as package')
        .alias('n')
        .description('Make your project')
        .action(callback);
}


async function callback(name, cmd) {
    try {
        name = name.toLocaleLowerCase();

        console.log(`Creating ${name}...`);

        await service.newProject(name);

        if (cmd.blank) {

        } else if (cmd.package) {

        } else {
            await service.mkdir();
            // service.generateErrorModules(name);
        }

        console.log(`Done! ${name} was raised.`);
    } catch (e) {
        console.error(e);
    }
}
