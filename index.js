require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { downloadAllFiles: downloadLstAndElevation } = require('./nasa_lst_elevation/data/downloader');
const { writeAsJson: writeElevationAsJson } = require('./nasa_lst_elevation/disk-writer');
const { downloadData: downloadLCData , formatFileNames } = require('./nasa_land_cover/nasa-scraper');
const { writeLCData } = require('./nasa_land_cover/ldope-automater');

// 1. Download files
// const linksPath = './nasa_land_cover/download-links.txt';
// downloadLCData(linksPath);
// 2. Then manually move downloaded files to the desired directory

// 3. Rename files if desired
// formatFileNames(dataDirectory)

// 4. Use LDope to analyze files
// Then grab relevant data
// const lcDataDirectory = path.join(__dirname, './nasa_land_cover/data/');
// writeLCData(lcDataDirectory);


// 5. Download LST+Elevation data
// downloadLstAndElevation();

// 6. Write LST+Elevation Data
// writeElevationAsJson();