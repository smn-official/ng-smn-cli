const commander = require('commander');
const service = require('./new.service');

class New {
    constructor() {
        commander
            .command('new <name>')
            .option('-b, --blank', 'Make a clear project')
            .option('-p, --package', 'Make project as package')
            .alias('n')
            .description('Make your project')
            .action(this.actionCommander);
    }

    // TODO: Instalar smn-ui
    async actionCommander(name, cmd) {
        try {
            name = name.toLocaleLowerCase();

            console.log(`Creating ${name}...`);

            await service.newProject(name);

            if (cmd.blank) {

            } else if (cmd.package) {

            } else {
                await service.mkdir(name);
                await service.generateErrorModules(name);
            }

            console.log(`Done! ${name} was raised.`);
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = New;


