const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const lcFormats = {
    igbp: {
        1: 'evergreen needleleaf forests',
        2: 'evergreen broadleaf forests',
        3: 'deciduous needleleaf forests',
        4: 'deciduous broadleaf forests',
        5: 'mixed forests',
        6: 'closed shrublands',
        7: 'open shrublands',
        8: 'woody savannas',
        9: 'savannas',
        10: 'grasslands',
        11: 'permanent wetlands',
        12: 'croplands',
        13: 'urban and built-up lands',
        14: 'cropland/natural vegetation mosaics',
        15: 'permanent snow and ice',
        16: 'barren',
        17: 'water bodies',
        255: 'unclassified'
    },
    umd: {
        0: 'water bodies',
        1: 'evergreen needleleaf forests',
        2: 'evergreen broadleaf forests',
        3: 'deciduous needleleaf forests',
        4: 'deciduous broadleaf forests',
        5: 'mixed forests',
        6: 'closed shrublands',
        7: 'open shrublands',
        8: 'woody savannas',
        9: 'savannas',
        10: 'grasslands',
        11: 'permanent wetlands',
        12: 'croplands',
        13: 'urban and built-up lands',
        14: 'cropland/natural vegetation mosaics',
        15: 'non-vegetated lands',
        255: 'unclassified'
    },
    lai: {
        0: 'water bodies',
        1: 'grasslands',
        2: 'shrublands',
        3: 'broadleaf croplands',
        4: 'savannas',
        5: 'evergreen broadleaf forests',
        6: 'deciduous broadleaf forests',
        7: 'evergreen needleleaf forests',
        8: 'deciduous needleleaf forests',
        9: 'non-vegetated lands',
        10: 'urban and built-up lands',
        255: 'unclassified'
    },
    bgc: {
        0: 'water bodies',
        1: 'evergreen needleleaf vegetation',
        2: 'evergreen broadleaf vegetation',
        3: 'deciduous needleleaf vegetation',
        4: 'deciduous broadleaf vegetation',
        5: 'annual broadleaf vegetation',
        6: 'annual grass vegetation',
        7: 'non-vegetated lands',
        8: 'urban and built-up lands',
        255: 'unclassified'
    },
    pft: {
        0: 'water bodies',
        1: 'evergreen needleleaf trees',
        2: 'evergreen broadleaf trees',
        3: 'deciduous needleleaf trees',
        4: 'deciduous broadleaf trees',
        5: 'shrub',
        6: 'grass',
        7: 'cereal croplands',
        8: 'broadleaf croplands',
        9: 'urban and built-up lands',
        10: 'permanent snow and ice',
        11: 'barren',
        255: 'unclassified',
    },
    lccs1: {
        1: 'barren',
        2: 'permanent snow and ice',
        3: 'water bodies',
        11: 'evergreen needleleaf trees',
        12: 'evergreen broadleaf trees',
        13: 'deciduous needleleaf trees',
        14: 'deciduous broadleaf trees',
        15: 'mixed broadleaf/needleleaf forests',
        16: 'mixed broadleaf evergreen/deciduous forests',
        21: 'open forests',
        22: 'sparse forests',
        31: 'dense herbaceous',
        32: 'sparse herbacious',
        41: 'dense shrublands',
        42: 'shrubland/grassland mosaics',
        43: 'sparse shrublands',
        255: 'unclassified'
    },
    lccs2: {
        1: 'barren',
        2: 'permanent snow and ice',
        3: 'water bodies',
        9: 'urban and built-up lands',
        10: 'dense forests',
        20: 'open forets',
        25: 'forest/cropland mosaics',
        30: 'natural herbaceous',
        35: 'natural herbacios/croplands mosaics',
        36: 'herbaceous croplands',
        40: 'shrublands',
        255: 'unclassified'
    },
    lccs3: {
        1: 'barren',
        2: 'permanent snow and ice',
        3: 'water bodies',
        10: 'dense forests',
        20: 'open forests',
        27: 'woody wetlands',
        30: 'grasslands',
        40: 'shrublands',
        50: 'herbaceous wetlands',
        51: 'tundra',
        255: 'unclassified'
    }
}

module.exports = {
    grabData: async (dataDirectory) => {
        const dataFiles = fs.readdirSync(dataDirectory);

        // dataFiles.forEach(async (fileName) => {

        const fileName = dataFiles[55];

        const coordinateData = await getCoordinateData(dataDirectory, fileName);
        // printObj(coordinateData)
        const formattedCoordinateData = formatCoordinateData(coordinateData);
        printObj(formattedCoordinateData);

        const lcData = await getLandCoverData(dataDirectory, fileName);
        // printObj(lcData);
        console.log('----')

        const formattedLCData = formatLCData(lcData);
        printObj(formattedLCData);

        // });
    }
}


const getCoordinateData = async (dataDirectory, fileName) => {
    const ldopeMetaDataCmd = `${process.env.read_meta} ${dataDirectory}${fileName}`;
    const metaData = (await runCmd(ldopeMetaDataCmd)).toLowerCase().split('\n');

    const coordinateLines = metaData.filter(line => line.includes('coordinate'));

    const east = parseFloat(coordinateLines[0].split(/\s|\r/)[2]);
    const west = parseFloat(coordinateLines[1].split(/\s|\r/)[2]);
    const south = parseFloat(coordinateLines[2].split(/\s|\r/)[2]);
    const north = parseFloat(coordinateLines[3].split(/\s|\r/)[2]);

    const coordinateData = {
        east,
        west,
        south,
        north
    }
    return coordinateData;
}
const formatCoordinateData = (coordinates) => {
    const { east, west, south, north } = coordinates;

    const formattedCoordinates = {
        long: (east + west) / 2,
        lat: (south + north) / 2
    }

    return formattedCoordinates;
}

const getLandCoverData = async (dataDirectory, fileName) => {
    const ldopeDataCmd = `${process.env.comp_sds_hist} ${dataDirectory}${fileName}`;
    const rawLCString = (await runCmd(ldopeDataCmd)).toLowerCase();

    // console.log(rawLCString);

    const [ , igbp, umd, lai, bgc, pft, , , , lccs1, lccs2, lccs3 ] = rawLCString.split('dimension =').map(data => {
        const lines = data.split('\n');
        return lines.slice(1, lines.length - 1).join('\n');
    });
    
    const rawLCObj = {
        igbp,
        umd,
        lai,
        bgc,
        pft,
        lccs1,
        lccs2,
        lccs3
    }
    
    const landCoverData = {};
    Object.keys(rawLCObj).forEach(key => {
        let mostLikelyLCType;
        let mostLikelyLCProb = 0;

        const data = rawLCObj[key];
        const lines = data.split('\n');
        lines.forEach(line => {
            const [ lc, prob ] = line.split(/\t|\r/).filter(notEmpty => notEmpty).map(str => parseInt(str));
            if(prob > mostLikelyLCProb){
                // console.log(`${key}\n${prob} > ${mostLikelyLCProb}\nlandCoverVal = ${lc}\n highestProb = ${prob}`)
                mostLikelyLCType = lc;
                mostLikelyLCProb = prob;
            }
        });
        
        landCoverData[key] = mostLikelyLCType;
    });    
    // Object.keys(landCover).forEach(key => console.log(`${key} = ${landCover[key]}`));
    
    return landCoverData;
}
const formatLCData = (landCoverData) => {
    const formattedLCData = {};

    Object.keys(landCoverData).forEach(formatValue => {
        const lcValue = landCoverData[formatValue];
        formattedLCData[formatValue] = lcFormats[formatValue][lcValue];
    });

    return formattedLCData;
}




const printArr = (arr) => {
    arr.forEach((a, i) => console.log(`${a}\n\n`));
}
const printObj = (obj) => {
    Object.keys(obj).forEach(key => console.log(`${key}: ${obj[key]}\n`));
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



// dataFiles.forEach(fileName => {
//     const command = `comp_sds_hist ${path}${fileName}`;
//     runCmd(command);
// });


// const command = spawn( 'comp_sds_hist', [ `${path}${dataFiles[0]}` ] );

// command.stdout.on( 'data', data => console.log( `stdout: ${data}` ) );
// command.stderr.on( 'data', data => console.log( `stderr: ${data}` ) );
// command.on('error', err => console.log(err));
// command.on( 'close', code => console.log( `child process exited with code ${code}` ) );