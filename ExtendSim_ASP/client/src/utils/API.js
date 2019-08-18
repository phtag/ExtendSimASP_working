import axios from 'axios';

export default {
  // Gets all posts
  getPosts: function() {
    return axios.get('/api/posts');
  },
  createPost: function(data) {
    return axios.post('/api/posts', data);
  },
  signup: function(data) {
    return axios.post('/api/users/signup', 
    {
      username: data.username,
      password: data.password
    });
  },
  login: function(data) {
   return axios.post('/api/users/login', data)
    // return axios.post('/api/users/login', data);
  },
  validateToken: function(t) {
    return axios.post('/api/users/validate', { token: t });
  },
  getserverextendmodelsrootdirectory: function(data) {
    const { username } = data;
    return axios.post('/api/ExtendSim/getserverextendmodelsrootdirectory',
      {
          username: username,
      }
    );
  },
  getmodelinfo: function(modelpathname, closeModel) {
    return axios.post('/api/ExtendSim/getmodelinfo',
      {
        modelpathname: modelpathname,
        closeModel: closeModel
      }
    );
  },
  getmodeldatabasetablefields: function(modelpathname, database, tablename, closeModel) {
    return axios.post('/api/ExtendSim/getmodeldatabasetablefields',
      {
        modelpathname: modelpathname,
        databasename: database,
        tablename: tablename,
        closeModel: closeModel
      }
    );
  },
  getmodeldatabasetables: function(modelpathname, database, closeModel) {
    return axios.post('/api/ExtendSim/getmodeldatabasetables',
      {
        modelPathname: modelpathname,
        database: database,
        closeModel: closeModel
      }
    );
  },
  getmodeldatabases: function(modelPathname, closeModel) {
    return axios.post('/api/ExtendSim/getmodeldatabases',
      {
        modelPathname: modelPathname,
        closeModel: closeModel
      }
    );
  },
  createScenario: function(data) {
    const { username, userLoginSessionID, scenarioName, currentUser } = data;
    return axios.post('/api/server/createscenario',
      {
          username: username,
          userLoginSessionID: userLoginSessionID, 
          scenarioName: scenarioName
      },
      {
        headers: 
        { 'Authorization': `Bearer ${currentUser.token}` }
      },
    );

  },
  createScenarioFolder: function(userLoginSessionID, scenarioFolderName, scenarioName) {
    return axios.post('/api/ExtendSim/createScenarioFolder', 
    { 
      userLoginSessionID: userLoginSessionID, 
      scenarioFolderName: scenarioFolderName,
      scenarioName: scenarioName 
    }); 
  },
  copyModelToScenarioFolder: function(modelPathname, scenarioFolderPathname, copyFolderContents) {
    return axios.post('/api/ExtendSim/copyModelToScenarioFolder', 
      { 
        modelPathname: modelPathname,
        scenarioFolderPathname: scenarioFolderPathname,
        copyFolderContents: copyFolderContents
      }); 
  },
  sendfile: function(scenarioFolderPathname, 
                     filename, 
                     filedata) {
    // return axios.post('/api/ExtendSim/sendfilepathname', 
    return axios.post('/api/ExtendSim/sendfile', 
    { 
      scenarioFolderPathname: scenarioFolderPathname,
      filename: filename,
      filedata: filedata
    })
  },
  senddialogvariabledata: function(modelPathname,
                                   blockNumber,
                                   variableName,
                                   variableValue,
                                   row,
                                   column) {
    return axios.post('/api/ExtendSim/senddialogvariabledata', 
    { 
      modelPathname: modelPathname,
      blockNumber: blockNumber,
      variableName: variableName,
      variableValue: variableValue,
      row: row,
      column: column
    })                                               
  },
  senddatastream: function(modelPathname, 
                           modelDatabaseName, 
                           databaseTableName,
                           tabledata) {
    // return axios.post('/api/ExtendSim/sendfilepathname', 
    return axios.post('/api/ExtendSim/senddatastream', 
    { 
      modelPathname: modelPathname,
      modelDatabaseName: modelDatabaseName,
      databaseTableName: databaseTableName,
      tabledata: tabledata
    })
  },
  submitSimulationScenario: function(
    userLoginSessionID,
    modelPathname,
    removeFolderOnCompletion) {
    // Invoke call to server
    return axios.post('/api/ExtendSim/submitsimulationscenario', 
    { 
      userLoginSessionID: userLoginSessionID,
      modelPathname: modelPathname,
      removeFolderOnCompletion: removeFolderOnCompletion
    })
  },
  checkmodelrunstatus: function(
    scenarioID) {
    return axios.post('/api/ExtendSim/checkmodelrunstatus', 
    { 
      scenarioID: scenarioID,
    })
  },
  getcycletimeresults: function (filepathname, userLoginSessionID, scenarioID, username) {
    return axios.post('/api/ExtendSim/getcycletimeresults',
    {
      filepathname: filepathname,
      userLoginSessionID: userLoginSessionID,
      scenarioID: scenarioID,
      username: username
    });
    // return response.data;
  },
  getdtabasetablecontentsstream: function(modelPathname,
                                          databaseName,
                                          tableName) {
    return axios.post('/api/ExtendSim/getdtabasetablecontentsstream',
    {
      modelPathname: modelPathname,
      databaseName: databaseName,
      tableName: tableName
    });
  },
  getscenarioresultsstream: function (route,
                                         modelPathname,
                                         databaseName,
                                         tableName, 
                                         userLoginSessionID, 
                                         scenarioID, 
                                         username) {
  return axios.post('/api/ExtendSim/' + route,
    {
      modelPathname: modelPathname,
      databaseName: databaseName,
      tableName: tableName,
      userLoginSessionID: userLoginSessionID,
      scenarioID: scenarioID,
      username: username
    });
  },
  getcycletimeresultsstream: function (modelPathname,
                                       databaseName,
                                       tableName, 
                                       userLoginSessionID, 
                                       scenarioID, 
                                       username) {
    return axios.post('/api/ExtendSim/getcycletimeresultsstream',
    {
      modelPathname: modelPathname,
      databaseName: databaseName,
      tableName: tableName,
      userLoginSessionID: userLoginSessionID,
      scenarioID: scenarioID,
      username: username
    });
    // return response.data;
  },
  getcycletimeresultsfromdb: function (username, scenarioID, userLoginSessionID, modelFilepath, modelDatabaseName, databaseTableName) {
    return axios.post('/api/ExtendSim/getcycletimeresultsfromdb',
    {
      username,
      scenarioID,
      userLoginSessionID,
      modelFilepath,
      modelDatabaseName,
      databaseTableName
    });
    // return response.data;
  },
  getresourceresults: function (filepathname, userLoginSessionID, scenarioID, username) {
    return axios.post('/api/ExtendSim/getresourceresults',
    {
      filepathname: filepathname,
      userLoginSessionID: userLoginSessionID,
      scenarioID: scenarioID,
      username: username
    });
    // return response.data;
  },
  getpoolresults: function (filepathname, userLoginSessionID, scenarioID, username) {
    return axios.post('/api/ExtendSim/getpoolresults',
    {
      filepathname: filepathname,
      userLoginSessionID: userLoginSessionID,
      scenarioID: scenarioID,
      username: username
    });
    // return response.data;
  },
  getmodelresults: function (filepathname, userLoginSessionID, scenarioID, username) {
    return axios.post('/api/ExtendSim/getmodelresults',
    {
      filepathname: filepathname,
      userLoginSessionID: userLoginSessionID,
      scenarioID: scenarioID,
      username: username
    });
    // return response.data;
  },
  getUserScenarios: function (username) {
    return axios.post('/api/ExtendSim/getuserscenarios',
    {
      username: username
    });
  },
  getScenarioCycletimeData: function (scenarioID, username) {
    return axios.post('/api/ExtendSim/getscenariocycletimedata',
    {
      scenarioID: scenarioID,
      username: username
    });
  },
  getResourceData: function (scenarioID, username) {
    return axios.post('/api/ExtendSim/getresourcedata',
    {
      scenarioID: scenarioID,
      username: username
    });
  },
  getPoolData: function (scenarioID, username) {
    return axios.post('/api/ExtendSim/getpooldata',
    {
      scenarioID: scenarioID,
      username: username
    });
  },
  updateScenarioData: function(whichUpdateType, 
                               username, 
                               scenarioID, 
                               userLoginSessionID,
                               resultsArchived) {
    return axios.post('/api/ExtendSim/updatescenariodata',
    {
      whichUpdateType: whichUpdateType,
      resultsArchived: resultsArchived,
      scenarioID: scenarioID,
      username: username,
      userLoginSessionID: userLoginSessionID
    });
  },
  deleteScenario: function(username, scenarioID) {
      return axios.post('/api/ExtendSim/deletescenario',
    {
      scenarioID: scenarioID,
      username: username
    });
  }
};
