require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Land Cover
const { downloadData: downloadLCData , formatFileNames } = require('./nasa_land_cover/nasa-scraper');
const { convert } = require('./nasa_land_cover/h4-to-h5');
const { writeLCData } = require('./nasa_land_cover/ldope-automater');

// Elevation and LST
// const { downloadAllFiles: downloadLstAndElevation } = require('./nasa_lst_elevation/data/downloader');
const { writeAsJson: writeElevationAsJson } = require('./nasa_lst_elevation/disk-writer');


// LAND COVER -------------

// 1. GET DATA: Download files
// const linksPath = './nasa_land_cover/download-links.txt';
// downloadLCData(linksPath);
// 2. Then manually move downloaded files to the desired directory

// 3. Rename files if desired
// formatFileNames(dataDirectory)

// 4. Convert h4 data to h5
// Download command line utility to do so from
// https://support.hdfgroup.org/ftp/HDF5/releases/tools/h4toh5/h4toh5-2.2.4/bin/
// I used windows/1.8.21-2.2.4-win7_64-vs14
convert('./nasa_land_cover/h5-data/');

// 5. Use LDope to analyze and write file data
// Then grab relevant data
// const lcDataDirectory = path.join(__dirname, './nasa_land_cover/data/');
// writeLCData(lcDataDirectory);


// LST + ELEVATION -------------

// 6. Download LST+Elevation data
// Do not run from here/index
// Instead, type 'cd nasa_lst_elevation/data' into the terminal and press enter
// Then type node downloader.js to run the method
// Or else 'unauthorized' error will be given
// downloadLstAndElevation();

// 7. Write LST+Elevation Data
// writeElevationAsJson();