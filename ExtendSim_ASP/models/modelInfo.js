module.exports = function(sequelize, DataTypes) {
    var modelinfo = sequelize.define("modelinfo", {
        variablename: DataTypes.STRING,
        dialogItemType: DataTypes.STRING,
        blockName: DataTypes.STRING,
        blockNumber: DataTypes.INTEGER,
        tabName: DataTypes.STRING,
        blockLabel: DataTypes.STRING,
        enclosingHblockNumber: DataTypes.INTEGER,	
        enclosingHblockLabel: DataTypes.STRING
    });
    return modelinfo;
  };
  