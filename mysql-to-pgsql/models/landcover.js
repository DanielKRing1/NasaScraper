module.exports = (sequelize, type) => {
    return sequelize.define('landcover', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        igbp: type.SMALLINT,
        umd: type.SMALLINT,
        lai: type.SMALLINT,
        bgc: type.SMALLINT,
        pft: type.SMALLINT,
        lccs1: type.SMALLINT,
        lccs2: type.SMALLINT,
        lccs3: type.SMALLINT,
        coordinates: type.GEOGRAPHY('POINT', 4326)
    },
    {
        timestamps: false,
        freezeTableName: true
    });
}