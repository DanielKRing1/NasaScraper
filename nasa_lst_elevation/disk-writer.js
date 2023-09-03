const path = require('path');
const spawn = require("child_process").spawn;

module.exports={

    writeAsJson: () => {
        console.log('here');
        const pyProcess = spawn('python', [path.join(__dirname, './writer.py')]);
        pyProcess.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        pyProcess.stderr.on('data', function (err) {
            console.log(err.toString());
        });
    }
}