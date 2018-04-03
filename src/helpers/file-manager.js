const {exec} = require('child_process');
const fs = require('fs');

module.exports = {
    copy,
    read
};

async function copy(src, dest) {
    return new Promise((resolve, reject) => {
        exec(`cp -r ${src} ${dest}`, err => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

async function read(src) {
    return new Promise((resolve, reject) => {
        fs.readFile(src, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data.toString());
        });
    });
}