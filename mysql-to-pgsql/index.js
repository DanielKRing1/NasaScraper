const Sequelize = require('sequelize');
const Op = Sequelize.Op
const AsterModel = require('./models/aster');
const LandCoverModel = require('./models/landcover');

const mysql = new Sequelize('geoapi', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});
const myLandCover = LandCoverModel(mysql, Sequelize);

const batchSize = 10000;

const my2pg = (startingId) => {
  myLandCover.findAll({
    where: {
      id: {
        [Op.gte]: startingId
      }
    },
    limit: batchSize
  })
    .then(data => {
      console.log(`Id ${startingId}!`);
      const nextStartingId = startingId + batchSize;
  
      data.forEach(location => {
        const { id, igbp, umd, lai, bgc, pft, lccs1, lccs2, lccs3, coordinates } = location.dataValues;

        pgLandCover.create({
          id,
          igbp,
          umd,
          lai,
          bgc,
          pft,
          lccs1,
          lccs2,
          lccs3,
          coordinates
        })
          .then(res => {
            if(id === nextStartingId - 1) my2pg(nextStartingId);
          })
          .catch(err => console.log(err));

      });

    });
}
my2pg(6827244);

// { id: 1,
//   elevation: -9999,
//   temperature: 291,
//   coordinate: { type: 'Point', coordinates: [ -34.969696, -1.030303 ] } }


  
const pgsql = new Sequelize('geoapi', 'postgres', 'abc123', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});
const pgLandCover = LandCoverModel(pgsql, Sequelize);
// pgAster.create({
//   id: 1,
//   elevation: -9999,
//   temperature: 291,
//   coordinate: { type: 'Point', coordinates: [ -34.969696, -1.030303 ] }
// })
//   .then(location => console.log(location));
  