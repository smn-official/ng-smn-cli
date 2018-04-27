const commander = require('commander');
const service = require('./new.service');
const Project = require('../../helpers/project');
const projectService = require('./new-project.service');

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

    async actionCommander(name, cmd) {
        try {
            Project.config = { name };

            console.log(`\nCreating ${Project.name}...`);

            await service.newProject();
            await service.installSMNUI();

            await Project.createConfig();

            if (cmd.blank) {

            } else if (cmd.package) {

            } else {
                await projectService.generate();
            }

            console.log(`\nDone! ${Project.name} was raised.`);
        } catch (e) {
            console.error(e);
            await service.deleteProject();
        }
    }
}

module.exports = New;


