const puppeteer = require('puppeteer');

const auth = Buffer.from(`${process.env.user}:${process.env.pass}`).toString('base64');

module.exports = {
  downloadData: async(linksPath) => {
    const links = readLinksFromFile(linksPath);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    links.forEach(async (link) => {
      await page.setExtraHTTPHeaders({
        'Authorization': `Basic ${auth}`                    
      });
      page.on('request', request => {
        // console.log(`Request: ${request.resourceType}: ${request.url} (${JSON.stringify(request.headers)})`)
      });
      
      try {
        await page.goto(link);
        
      }catch(err) {
        console.log(err);
      }
    });
  },

  formatFileNames: (dataDirectory) => {
    const dataFiles = fs.readdirSync(dataDirectory);

    // Remove spaces and duplicate naming convention,
    // ie 'fileName (1).hdf' -> 'fileName.hdf'
    dataFiles.forEach(fileName => {
        if(fileName.includes('(')){
            const leftP = fileName.indexOf('(');
            const rightP = fileName.indexOf(')');

            const newName = fileName.slice(0, leftP - 1) + fileName.slice(rightP + 1);
            console.log(newName)
            fs.renameSync(path + fileName, path + newName);
        }
    });
  }
}

const readLinksFromFile = (linksPath) => {
  const links = fs.readFileSync(linksPath, 'utf8').split("\n");

  return links;
}