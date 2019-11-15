const spawn = require("child_process").spawn; 

module.exports={

    writeAsJson: () => {
        pyProcess = spawn('python',["./disk-writer.py"]);

        pyProcess.stdout.on('data', (data) => {
            console.log(`From python disk-writer:\n${data}`);
        });
    }
}