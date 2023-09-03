const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const h4Directory = './nasa_land_cover/data';

module.exports = {
    convert: async (h5Directory) => {
        const h4Files = fs.readdirSync(h4Directory);
        
        h4Files.forEach(async (fileName, i) => {
            console.log(Math.round(i/h4Files.length*10000) / 100 + '%');
            const command = `h4toh5convert ${h4Directory}/${fileName} ${h5Directory}/${fileName.slice(0, -4)}.h5`;

            await runCmd(command);
        });

    }
}

const runCmd = async (command) => {
    try {
        const { stdout, stderr } = await exec(command);
        // console.log(stdout)
        // console.log(stderr)

        return stdout;

    }catch(err) {
        console.log(err);
    }
}