var axios = require("axios");

// Heroku IP address
var IPaddress = "184.171.246.58";
// var IPaddress = "192.168.1.149";
// var IPaddress = "192.168.1.149";

const c_completiondate_scenarioUpdateType = "completiondate";
const c_resultsArchived_scenarioUpdateType = "resultsarchived";
const c_status_scenarioUpdateType = "status";
// Routes
// =============================================================
module.exports = {
    getserverextendmodelsrootdirectory: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerExtendModelsRootDirectory"
        var myheaders = { 
            accept: "application/json", 
        }; 
        axios({
            url: queryURL,
            method: 'post',
            accept : 'application/json',
            contentType: 'application/json;charset=utf-8',
            headers : myheaders,
            muteHttpExceptions : false,
            params : {
                username : req.body.username
            }
        }).then(function(response) {
            console.log('getserverextendmodelsrootdirectory: response=' + response.data);
            userModelPath = response.data;
            var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerDirectoryFiles"
            axios({
                url: queryURL,
                method: 'post',
                accept : 'application/json',
                contentType: 'application/json;charset=utf-8',
                headers : myheaders,
                muteHttpExceptions : false,
                params : {
                    directoryPathname : userModelPath
                }
            })
            .then(function(response2) {
                return res.json({ userDirectoryFiles: response2.data });
            })
        });
    },
    getserverscenariofolderdirectory: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerDirectoryFiles"
        var myheaders = { 
            accept: "application/json", 
        }; 
        axios({
            url: queryURL,
            method: 'post',
            accept : 'application/json',
            contentType: 'application/json;charset=utf-8',
            headers : myheaders,
            muteHttpExceptions : false,
            params : {
                directoryPathname : req.body.scenarioFolderPathname
            }
        }).then(function(response) {
            return res.json({ scenarioFolderFiles: response.data });
        });
    },
    getmodelinfo: function(req, res) {
        var myheaders = { 
            accept: "application/json", 
        }; 
        console.log('getmodelinfo: modelPathname=' + req.body.modelpathname);
        var queryURL = "http://" + IPaddress + ":8080/ExtendSimService/web/GetModelInfo"
        axios({
            url: queryURL,
            method: 'get',
            accept : 'application/json',
            contentType: 'application/json;charset=utf-8',
            headers : myheaders,
            muteHttpExceptions : false,
            params : {
                modelPathname : req.body.modelpathname,
                closeModel: req.body.closeModel
            }
        })
        .then(function(response) {
            console.log('getmodelinfo=' + response.data);
            var modelInfo = response.data;        
            return res.json({ ModelInfo: modelInfo });
        })
    },
    getdialogvariabledata: function(req, res) {
                // result = .myStreamingServiceClient.SendDataTableESdataTarget(ESdatabaseData.selectedModelPathname, ESdatabaseData.selectedDatabase, ESdatabaseData.selectedTable)
        // .myStreamingServiceClient.SendDataTableESdataStream(myESdataStream.EDS_dataStream)
        var myheaders = { 
            accept: "application/json", 
        };     
        var queryURL =  "http://" + IPaddress + ":8080/ExtendSimService/web/ES_GetModelData";
        console.log("getdialogvariabledata - model pathname =" + req.body.modelPathname + 
            " blockNumber=" + req.body.blockNumber + 
            " variable name=" + req.body.variableName);

        var item = req.body.variableName + ":#" +
                    req.body.blockNumber.toString() + ":" +
                    req.body.row.toString() + ":" +
                    req.body.column.toString();
        var modelPathname = req.body.modelPathname;
        console.log("getdialogvariabledata - model pathname =" + req.body.modelPathname + 
            " blockNumber=" + req.body.blockNumber + 
            " variable name=" + req.body.variableName);
        return axios({
            url: queryURL,
            method: 'get',
            accept : "application/json",
            contentType: "application/json;charset=utf-8",
            headers : myheaders,
            muteHttpExceptions : false,
            params: {
                Topic: "System",
                Item: item,                  
                modelPathname: modelPathname
            }
        }).then(function(response) {
            // Convert the file stream data into a memory stream from which the server
            // can load the data directly into an array
            // var reader = new streams.ReadableStream(req.body.tabledata);
            return res.json({result: response.data})  
        });  
    },
    getmodeldatabasetablefields: function(req, res) {
        var myheaders = { 
            accept: "application/json", 
        }; 
        console.log('getmodeldatabasetablefields: modelPathname=' + req.body.modelpathname + ' database=' + req.body.databasename + ' table=' + req.body.tablename);
        var queryURL = "http://" + IPaddress + ":8080/ExtendSimService/web/GetModelDatabaseTableFields"
        axios({
            url: queryURL,
            method: 'get',
            accept : 'application/json',
            contentType: 'application/json;charset=utf-8',
            headers : myheaders,
            muteHttpExceptions : false,
            params : {
                modelPathname : req.body.modelpathname,
                databaseName_ref: req.body.databasename,
                tableName_ref: req.body.tablename,
                closeModel: req.body.closeModel
            }
        })
        .then(function(response) {
            console.log('modelDatabaseTableFields=' + response.data);
            return res.json({ modelDatabaseTableFields: response.data });
        })
    },
    getmodeldatabasetables: function(req, res) {
        var myheaders = { 
            accept: "application/json", 
        }; 
        console.log('getmodeldatabasetables: modelPathname=' + req.body.modelPathname + ' database=' + req.body.database);
        var queryURL = "http://" + IPaddress + ":8080/ExtendSimService/web/GetModelDatabaseTables"
        axios({
            url: queryURL,
            method: 'get',
            accept : 'application/json',
            contentType: 'application/json;charset=utf-8',
            headers : myheaders,
            muteHttpExceptions : false,
            params : {
                modelPathname : req.body.modelPathname,
                databaseName_ref: req.body.database,
                closeModel: req.body.closeModel
            }
        })
        .then(function(response) {
            console.log('modelDatabaseTables=' + response.data);
            return res.json({ modelDatabaseTables: response.data });
        })
    },
    getmodeldatabases: function(req, res) {
        var myheaders = { 
            accept: "application/json", 
        }; 
        console.log('getmodeldatabases: modelPathname=' + req.body.modelPathname);
        var queryURL = "http://" + IPaddress + ":8080/ExtendSimService/web/GetModelDatabases"
        axios({
            url: queryURL,
            method: 'get',
            accept : 'application/json',
            contentType: 'application/json;charset=utf-8',
            headers : myheaders,
            muteHttpExceptions : false,
            params : {
                modelPathname : req.body.modelPathname,
                closeModel: req.body.closeModel
            }
        })
        .then(function(response) {
            console.log('modelDatabases=' + response.data);
            return res.json({ modelDatabases: response.data });
        })
    },
    getUserModelPaths: function(req, res) {
        var myheaders = { 
            accept: "application/json", 
        }; 
        console.log('getUserModelPaths: username=' + req.body.username);
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetUserModelPaths"
        axios({
            url: queryURL,
            method: 'post',
            accept : 'application/json',
            contentType: 'application/json;charset=utf-8',
            headers : myheaders,
            muteHttpExceptions : false,
            params : {
                username : req.body.username,
            }
        })
        .then(function(response) {
            console.log('user model paths=' + response.data);
            return res.json({ userModelPaths: response.data });
        })
    },
    createScenarioFolder: function(req, res) {
        const { userLoginSessionID, scenarioFolderName } = req.body;
        console.log("createScenarioFolder: userLoginSessionID=" + userLoginSessionID + " folder name=" + scenarioFolderName);
            // Execute WCF service to create a scenario folder  
            // var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/CreateScenarioFolder"
        var myheaders = { 
            accept: "application/json", 
        }; 
        var options1 = {
            method : "GET",
            accept : "application/json",
            contentType: "application/json;charset=utf-8",
            headers : myheaders,
            muteHttpExceptions : false
        };
        axios({
            url: queryURL,
            method: 'get',
            accept : 'application/json',
            contentType: 'application/json;charset=utf-8',
            headers : myheaders,
            muteHttpExceptions : false,
            params : {
                scenarioFoldername : scenarioFolderName
            }
        }).then(function(response) {
            console.log('createScenarioFolder: response=' + response.data);
            scenarioFolderPathname = response.data;
            return res.json({ scenarioFolderPathname: response.data });
        });
    },
    copyModelToScenarioFolder: function(req, res) {
        const modelPathname = req.body.modelPathname;
        const scenarioFolderPathname = req.body.scenarioFolderPathname;
        const copyFolderContents = req.body.copyFolderContents;
        console.log("copyModelToScenarioFolder: scenarioFolderPathname=" + scenarioFolderPathname);
        // Execute WCF service to copy the model folder to the scenario folder 
          var myheaders = { 
              accept: "application/json", 
          };
          var options2 = {
              method : "POST",
              accept : "application/json",
              contentType: "application/json;charset=utf-8",
              headers : myheaders,
              muteHttpExceptions : false
            };
            var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/CopyModelToScenarioFolder";
          axios({
              url: queryURL,
              method: 'post',
              accept: 'application/json',
              contentType: 'application/json;charset=utf-8',
              headers: myheaders,
              muteHttpExceptions : false,
              params: {
                modelPathname : modelPathname,
                scenarioFolderpath: scenarioFolderPathname,
                copyFolderContents: copyFolderContents
              }
          }).then(function(response) {
              console.log('copyModelToScenarioFolder: ' + response.data); 
              return res.json({result: response.data});
        });
    },
    getfile: function(req, res) {
        var myheaders = { 
            accept: "application/json", 
        };     
        var queryURL =  "http://" + IPaddress + ":8090/StreamingService/web/GetStream";
        // ?filepathname=" + encodeURIComponent(req.body.scenarioFolderPathname + "/" + req.body.filename);
        console.log("getfile - filepathname=" + req.body.filepath);
        return axios({
            url: queryURL,
            method: 'post',
            accept : "application/json",
            contentType: "application/json;charset=utf-8",
            headers : myheaders,
            muteHttpExceptions : false,
            params: {
                filename : req.body.filepath
            }
        }).then(function(response) {
            console.log("Upload RETURN");
            return res.json({result: response.data})
        }).catch(function(error) {
            console.log("Error: " + error);
            return res.json({ error: error });
          
        })

    },
    sendfile: function(req, res) {
        var myheaders = { 
            accept: "application/json", 
        };     
        var queryURL =  "http://" + IPaddress + ":8090/StreamingService/web/UploadPathname";
        // ?filepathname=" + encodeURIComponent(req.body.scenarioFolderPathname + "/" + req.body.filename);
        console.log("sendfile - filepathname=" + req.body.scenarioFolderPathname + "/" + req.body.filename);
        return axios({
            url: queryURL,
            method: 'post',
            accept : "application/json",
            contentType: "application/json;charset=utf-8",
            headers : myheaders,
            muteHttpExceptions : false,
            params: {
                filepathname : req.body.scenarioFolderPathname + "/" + req.body.filename
            }
        }).then(function(response){
            var queryURL =  "http://" + IPaddress + ":8090/StreamingService/web/UploadStream";
            console.log("UploadStream: req.body.filedata=" + req.body.filedata);
            return axios({
                url: queryURL,
                method: 'post',
                accept : 'application/json',
                //    contentType: 'application/json;charset=utf-8',
                contentType: 'multipart/form-data',
                headers : myheaders,
                data: req.body.filedata,
                //    payload : result,
                muteHttpExceptions : false
            }).then(function(uploadResponse) 
            { 
                console.log("Upload RETURN");
                return res.json({result: uploadResponse.data})
            })
        })
    },
    senddialogvariabledata: function(req, res) {
                // result = .myStreamingServiceClient.SendDataTableESdataTarget(ESdatabaseData.selectedModelPathname, ESdatabaseData.selectedDatabase, ESdatabaseData.selectedTable)
        // .myStreamingServiceClient.SendDataTableESdataStream(myESdataStream.EDS_dataStream)
        var myheaders = { 
            accept: "application/json", 
        };     
        var queryURL =  "http://" + IPaddress + ":8080/ExtendSimService/web/ES_SetModelData";
        // ?filepathname=" + encodeURIComponent(req.body.scenarioFolderPathname + "/" + req.body.filename);
        var item = req.body.variableName + ":#" +
                    req.body.blockNumber.toString() + ":" +
                    req.body.row.toString() + ":" +
                    req.body.column.toString();
        var variableValue = req.body.variableValue.toString();
        var modelPathname = req.body.modelPathname;
        console.log("senddialogvariabledata - model pathname =" + req.body.modelPathname + 
            " blockNumber=" + req.body.blockNumber + 
            " variable name=" + req.body.variableName +
            " variable value=" + variableValue);
        return axios({
            url: queryURL,
            method: 'post',
            accept : "application/json",
            contentType: "application/json;charset=utf-8",
            headers : myheaders,
            muteHttpExceptions : false,
            params: {
                Topic: "System",
                Item: item,                  
                Value: variableValue,
                modelPathname: modelPathname
            }
        }).then(function(response) {
            // Convert the file stream data into a memory stream from which the server
            // can load the data directly into an array
            // var reader = new streams.ReadableStream(req.body.tabledata);
            return res.json({result: response.data})  
        });  
    },
    senddatastream: function(req, res) {
        // result = .myStreamingServiceClient.SendDataTableESdataTarget(ESdatabaseData.selectedModelPathname, ESdatabaseData.selectedDatabase, ESdatabaseData.selectedTable)
        // .myStreamingServiceClient.SendDataTableESdataStream(myESdataStream.EDS_dataStream)
        var myheaders = { 
            accept: "application/json", 
        };     
        var queryURL =  "http://" + IPaddress + ":8090/StreamingService/web/SendDataTableESdataTarget";
        // ?filepathname=" + encodeURIComponent(req.body.scenarioFolderPathname + "/" + req.body.filename);
        console.log("senddatastream - model pathname =" + req.body.modelPathname + 
            " model database=" + req.body.modelDatabaseName + 
            " model table=" + req.body.databaseTableName,);
        return axios({
            url: queryURL,
            method: 'post',
            accept : "application/json",
            contentType: "application/json;charset=utf-8",
            headers : myheaders,
            muteHttpExceptions : false,
            params: {
                EDmodelPathname: req.body.modelPathname,
                EDmodelDatabaseName: req.body.modelDatabaseName,
                EDmodelTableName: req.body.databaseTableName
            }
        }).then(function(response) {
            // Convert the file stream data into a memory stream from which the server
            // can load the data directly into an array
            // var reader = new streams.ReadableStream(req.body.tabledata);
            var queryURL =  "http://" + IPaddress + ":8090/StreamingService/web/SendDataTableESdataStream2";
            console.log("UploadStream: req.body.tabledata=" + req.body.tabledata + " response=" + response  );
            // var memStream = new memoryStream(req.body.tabledata);
            return axios({
                url: queryURL,
                method: 'post',
                accept : 'application/json',
                //    contentType: 'application/json;charset=utf-8',
                contentType: 'multipart/form-data',
                headers : myheaders,
                data: req.body.tabledata,
                muteHttpExceptions : false
            }).then(function(uploadResponse) 
            { 
                console.log("Upload RETURN");
                return res.json({result: uploadResponse.data})
            })
        })
    },
    submitsimulationscenario: function(req, res) {
        const myheaders = { 
            accept: "application/json", 
        };
        const userLoginSessionID = req.body.userLoginSessionID;
        const modelPathname = req.body.modelPathname;
        const removeFolderOnCompletion = req.body.modelPathname;
        var scenarioID;
        var queryURL = "http://" + IPaddress + ":8080/ExtendSimService/web/SubmitSimulationScenario_TF";
        console.log("ExtendSimSubmitScenario: submitting simulation scenario for userLoginSessionID=" + req.body.userLoginSessionID);
        return axios({
            url: queryURL,
            method: 'post',
            accept : "application/json",
            contentType: "application/json;charset=utf-8",
            headers : myheaders,
            muteHttpExceptions : false,
            params: 
            {
                userLoginSession_ID: req.body.userLoginSessionID,
                modelPathname: req.body.modelPathname,
                removeScenarioFolderOnCompletion: req.body.removeFolderOnCompletion
            }
        }).then(function(response) {
            scenarioID = response.data;
            console.log("ExtendSimSubmitScenario: scenarioID=" + response.data);
            return res.json({scenarioID: response.data});     
        });
    },
    checkmodelrunstatus: function(req, res) {
        var myheaders = { 
            accept: "application/json", 
        };
        var queryURL = "http://" + IPaddress + ":8080/ExtendSimService/web/CheckModelRunStatus";
        console.log("ExtendSimCheckModelRunStatus: Making call to server...");
        return axios({
            url: queryURL,
            method: 'get',
            accept : "application/json",
            contentType: "application/json;charset=utf-8",
            headers : myheaders,
            muteHttpExceptions : false,
            params: 
            {
                scenario_ID: req.body.scenarioID
            }
        }).then(function(response) {
            var modelRunStatus = response.data;
            console.log("ExtendSimCheckModelRunStatus: Model run status=" + modelRunStatus);
            return res.json({modelRunStatus: response.data});
        });
    },
    getdatabasetablecontentsstream: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/ReceiveDataTableESdataStream2";
        var myheaders = { 
            accept: "application/json", 
            }; 
        console.log("getdatabasetablecontentsstream:  model pathname=" + req.body.modelPathname + " database=" + req.body.databaseName + " table=" + req.body.tableName);
        return axios({
            url: queryURL,
            method: 'get',
            accept : "application/json",
            responseType: "blob",
            headers : myheaders,
            muteHttpExceptions : false,
            params: 
            {
                EDmodelPathname: req.body.modelPathname,
                EDmodelDatabaseName: req.body.databaseName,
                EDmodelTableName: req.body.tableName
            }
        }).then(function(response) {
            var tableData  = response.data;
            var tableDataArray = tableData.split('\r\n').map(function(ln){
                return ln.split('\t');
            });
            // Remove last empty element from array
            tableDataArray.pop();

            console.log("getdtabasetablecontentsstream: response=" + response.data);
            if (req.body.tableName === "ModelDialogVariables") {
                console.log("tableDataArray.length =" + tableDataArray.length);
                var row = 1;
                res.json({tableDataArray: tableDataArray});          
            }
            else {
                return res.json({tableDataArray: tableDataArray});   
            }   
        });
    },
};
