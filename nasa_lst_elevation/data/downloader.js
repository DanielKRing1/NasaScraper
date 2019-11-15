
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const INTERVAL_RATE = 500;
const links = fs.readFileSync(path.join(__dirname, '../download-links.txt'), 'utf8').split(/\n|\r/).filter(notEmpty => notEmpty);

module.exports = {
    downloadAllFiles: async () => {

        let fileNum = 0;
        let intervalPtr = setInterval(() => {
            runCmd(fileNum);
            fileNum++;

                    
            if(fileNum >= links.length) clearInterval(intervalPtr);
        }, INTERVAL_RATE);

        // links.forEach(link => {
        //     console.log(link);
        // })
        // runCmd(downloadCommand);
    }
}

module.exports.downloadAllFiles();

async function runCmd(fileNum) {
    console.log(Math.round(fileNum / links.length * 10000) / 100 + "%");
    
    const link = links[fileNum];
    const fileName = link.slice(link.lastIndexOf('/') + 1);
    
    const downloadCommand = `curl -f -b "../cookies.tWMoSsbKhU" -c "../cookies.tWMoSsbKhU" -L --netrc-file "../netrc.ln2OhWdY2S" -g -o ${fileName} -- ${link}`;
    try {

        const { stdout, stderr } = await exec(downloadCommand);
        // console.log(stdout)
        // console.log(stderr)


    }catch(err) {
        if(fileNum < links.length){
            setTimeout(() => runCmd(fileNum), INTERVAL_RATE);
        }
    }
}