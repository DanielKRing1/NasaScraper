require('dotenv').config();
const fs = require('fs');
const { downloadAllFiles: downloadLstAndElevation } = require('./nasa_lst_elevation/data/downloader');
const { downloadData , formatFileNames } = require('.nasa_land_cover/nasa-scraper');
const { grabData } = require('./nasa_land_cover/ldope-automater');

// 1. Download files
// const linksPath = './nasa_land_cover/download-links.txt';
// downloadData(linksPath);
// 2. Then manually move downloaded files to the desired directory

const dataDirectory = './nasa_land_cover/data_300';
// 3. Rename files if desired
// formatFileNames(dataDirectory)

// 4. Use LDope to analyze files
// Then grab relevant data
// grabData(dataDirectory);

downloadLstAndElevation();