const path = require('path');

const config = {
    url: {
        base: path.join(process.cwd()),
        core: path.join(process.cwd(), 'src/core'),
        helpers: path.join(process.cwd(), 'src/helpers'),
    }
};

module.exports = config;

