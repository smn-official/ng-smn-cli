const commander = require('commander');
const service = require('./new.service');
const Project = require('../../helpers/project');

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
            Project.name = name;

            console.log(`\nCreating ${Project.name}...`);

            await service.newProject();
            await service.installSMNUI();

            await Project.createConfig();

            if (cmd.blank) {

            } else if (cmd.package) {

            } else {
                await service.mkdir();
                await service.generateErrorModules();
            }

            console.log(`\nDone! ${Project.name} was raised.`);
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = New;


