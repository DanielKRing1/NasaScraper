module.exports = (sequelize, type) => {
    return sequelize.define('aster', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        elevation: type.SMALLINT,
        temperature: type.SMALLINT,
        coordinate: type.GEOGRAPHY('POINT', 4326)
    },
    {
        timestamps: false,
        freezeTableName: true
    });
}