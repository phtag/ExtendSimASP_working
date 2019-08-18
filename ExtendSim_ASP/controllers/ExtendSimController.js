var db = require('../models');
var jwt = require('jsonwebtoken');
var axios = require("axios");
var fs = require("fs");
var streams = require('memory-streams');
var memoryStream = require('memorystream');
var reader = require('filereader');
// const JSON = require('circular-json');
// const FileDownload = require('js-file-download');

// Heroku IP address
var IPaddress = "184.171.246.58";
// var IPaddress = "192.168.1.149";
// var IPaddress = "192.168.1.149";

const c_scenarioSubmittedStatus = "submitted";
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
    createScenarioFolder: function(req, res) {
        const { userLoginSessionID, scenarioName, scenarioFolderName } = req.body;
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
        //  var response = UrlFetchApp.fetch(url_createScenarioFolder, options1).getContentText()
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
            // return res.json({ scenarioFolderPathname: response.data });
            db.scenario.update({
                scenarioName: scenarioName
            }, {
                where: {
                    userLoginSessionID: userLoginSessionID,
                    scenarioName: null
                }
            }).then(function(dbresponse) {
                return res.json({ scenarioFolderPathname: response.data });
            });
        });
    },
    updatescenariodata: function(req, res) {
        switch (req.body.whichUpdateType) {
            case c_completiondate_scenarioUpdateType:
                db.scenario.update({
                    scenarioCompletionDateTime: new Date(),
                }, {
                    where: {
                        userLoginSessionID: req.body.userLoginSessionID
                    }
                }).then(function(dbresponse) {
                    console.log('updatescenariodata: returned results for update type=' + req.body.whichUpdateType);
                    return res.json({ dbresponse: dbresponse.data });
                });
                break;
            case c_resultsArchived_scenarioUpdateType:
                db.scenario.update({
                    resultsArchived: req.body.resultsArchived,
                }, {
                    where: {
                        userLoginSessionID: req.body.userLoginSessionID
                    }
                }).then(function(dbresponse) {
                    return res.json({ dbresponse: dbresponse.data });
                });
                break;
            case c_status_scenarioUpdateType:
                db.scenario.update({
                    status: req.status,
                }, {
                    where: {
                        userLoginSessionID: req.body.userLoginSessionID
                    }
                }).then(function(dbresponse) {
                    return res.json({ dbresponse: dbresponse.data });
                });
                break;
        }         
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
                    req.body.column.toString()   
        console.log("senddialogvariabledata - model pathname =" + req.body.modelPathname + 
            " blockNumber=" + req.body.blockNumber + 
            " variable name=" + req.body.variableName +
            " variable value=" + req.body.variableName);
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
                Value: req.body.variableValue,
                modelPathname: req.body.modelPathname
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
            // ExtendSimCheckModelRunStatus(userLoginSessionID);
            console.log("ExtendSimSubmitScenario: scenarioID=" + response.data);
            // update the user's scenario ID and submission time in the database
            db.scenario.update({
                scenarioID: response.data,
                scenarioModelPathname: req.body.modelPathname,
                resultsArchived: false,
                status: c_scenarioSubmittedStatus,
                scenarioSubmissionDateTime: new Date(),
            }, {
                where: {
                    userLoginSessionID: userLoginSessionID,
                    scenarioID: null
                }
            }).then(function(dbresponse) {
                return res.json({scenarioID: response.data});     
            });
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
    getcycletimeresults: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerFileStream";
        var myheaders = { 
            accept: "application/json", 
            }; 
        var scenarioResults;
        console.log("ExtendSimASPgetScenarioResults: Getting scenario results from server for userSessionID=" + req.body.userLoginSessionID + " filename=" + req.body.filepathname);
        return axios({
            url: queryURL,
            method: 'post',
            accept : "application/json",
            // contentType: "application/octet-stream",
            responseType: "blob",
            headers : myheaders,
            muteHttpExceptions : false,
            params: 
            {
                filename: req.body.filepathname
            }
        }).then(function(response) {
            scenarioResults = response.data;
            console.log("ExtendSimASPgetScenarioResults: response=" + response.data);
            db.scenario.update({
                scenarioCompletionDateTime: new Date(),
            }, {
                where: {
                    userLoginSessionID: req.body.userLoginSessionID
                }
            }).then(function(dbresponse) {
                // reader.readAsText(scenarioResults);
                // reader.readAsBinaryString(scenarioResults);
                var myResult = JSON.stringify(scenarioResults);
                console.log("MyResult=" + myResult);
                var textArr = myResult.split(/\r\n|\r|\n/g);
                console.log("textArr.length =" + textArr.length);
                var scenarioResultsArray = scenarioResults.split('\r\n').map(function(ln){
                    return ln.split('\t');
                });
                // Remove last empty element from array
                scenarioResultsArray.pop();
                console.log("scenarioResultsArray.length =" + scenarioResultsArray.length);
                var row = 1;
                scenarioResultsArray.forEach(function(element, index) {
                    db.cycletime.create({
                        username: req.body.username,
                        scenarioID: req.body.scenarioID,
                        userLoginSessionID: req.body.userLoginSessionID,
                        sequenceNumber: index,
                        stepname: element[0],
                        resourceRequirement: element[1],
                        totalJobsProcessed: element[2],
                        totalProcessTime: element[3],
                        totalWaitTime: element[4],
                        avgProcessTime: element[5],
                        avgWaitTime: element[6],
                        avgCycleTime: element[7],
                        CoVarrivals: element[8],
                        CoVdepartures: element[9]
                    });
                });
                // console.log("splitArray =" + splitArray);            
                return res.json({cycleTimeData: scenarioResults});     
            });    
        });
    },
    getdtabasetablecontentsstream: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/ReceiveDataTableESdataStream2";
        var myheaders = { 
            accept: "application/json", 
            }; 
        console.log("getdtabasetablecontentsstream: Getting database table contents for table=" + req.body.tableName);
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
                tableDataArray.forEach(function(element, index) {
                    db.modelinfo.create({
                        variablename: element[0],
                        dialogItemType: element[1],
                        blockName: element[2],
                        blockNumber: element[3],
                        tabName: element[4],
                        blockLabel: element[5],
                        enclosingHblockNumber: element[6],	
                        enclosingHblockLabel: element[7]
                    })
                    .then(function() {
                        if ((tableDataArray.length - 1) === index) {
                            res.json({tableDataArray: tableDataArray});          
                        }
                    });
                });
            }
            else {
                return res.json({tableDataArray: tableDataArray});   
            }   
        });
    },
    getcycletimeresultsstream: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/ReceiveDataTableESdataStream2";
        var myheaders = { 
            accept: "application/json", 
            }; 
        var scenarioResults;
        console.log("getcycletimeresultsstream: Getting cycle time results from server for userSessionID=" + req.body.userLoginSessionID);
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
            scenarioResults = response.data;
            console.log("ExtendSimASPgetScenarioResults: response=" + response.data);
            db.scenario.update({
                scenarioCompletionDateTime: new Date(),
            }, {
                where: {
                    userLoginSessionID: req.body.userLoginSessionID
                }
            }).then(function(dbresponse) {
                var myResult = JSON.stringify(scenarioResults);
                console.log("MyResult=" + myResult);
                var textArr = myResult.split(/\r\n|\r|\n/g);
                console.log("textArr.length =" + textArr.length);
                var scenarioResultsArray = scenarioResults.split('\r\n').map(function(ln){
                    return ln.split('\t');
                });
                // Remove last empty element from array
                scenarioResultsArray.pop();
                console.log("scenarioResultsArray.length =" + scenarioResultsArray.length);
                var row = 1;
                scenarioResultsArray.forEach(function(element, index) {
                    db.cycletime.create({
                        username: req.body.username,
                        scenarioID: req.body.scenarioID,
                        userLoginSessionID: req.body.userLoginSessionID,
                        sequenceNumber: index,
                        stepname: element[0],
                        resourceRequirement: element[1],
                        totalJobsProcessed: element[2],
                        totalProcessTime: element[3],
                        totalWaitTime: element[4],
                        avgProcessTime: element[5],
                        avgWaitTime: element[6],
                        avgCycleTime: element[7],
                        CoVarrivals: element[8],
                        CoVdepartures: element[9]
                    })
                    .then(function(dbcreateresponse) {
                        if ((scenarioResultsArray.length - 1) === index) {
                            return res.json({cycleTimeData: scenarioResults});     
                        }
                    });
                });
                // console.log("splitArray =" + splitArray);            
                // return res.json({cycleTimeData: scenarioResults});     
            });    
        });
    },
    getscenariocycletimedata: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerFileStream";
        var myheaders = { 
            accept: "application/json", 
            }; 
        console.log("getscenariocycletimedata:Querying database for userLoginSessionID=" + req.body.userLoginSessionID);
        db.cycletime.findAll({
            where: {
                scenarioID: req.body.scenarioID,
                username: req.body.username
            },
            order: [
                ['sequenceNumber', 'ASC']
                // ['totalWaitTime', 'DESC']
            ],
          }).then(function(dbresponse) {
            console.log("Response=" + dbresponse);
            return res.json({cycleTimeData: dbresponse});     
        });    
    },
    getresourceresults: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerFileStream";
        var myheaders = { 
            accept: "application/json", 
            }; 
        var resourceResults;
        console.log("getresourceresults: Getting resource results from server for filepathname=" + req.body.filepathname);
        return axios({
            url: queryURL,
            method: 'post',
            accept : "application/json",
            // contentType: "application/octet-stream",
            responseType: "blob",
            headers : myheaders,
            muteHttpExceptions : false,
            params: 
            {
                filename: req.body.filepathname
            }
        }).then(function(response) {
            resourceResults = response.data;
            console.log("ExtendSimASPgetresourceResults: response=" + response.data);
            db.scenario.update({
                scenarioCompletionDateTime: new Date(),
            }, {
                where: {
                    userLoginSessionID: req.body.userLoginSessionID
                }
            }).then(function(dbresponse) {
                var myResult = JSON.stringify(resourceResults);
                console.log("MyResult=" + myResult);
                var textArr = myResult.split(/\r\n|\r|\n/g);
                console.log("textArr.length =" + textArr.length);
                var resourceResultsArray = resourceResults.split('\r\n').map(function(ln){
                    return ln.split('\t');
                });
                // Remove last empty element from array
                resourceResultsArray.pop();
                console.log("resourceResultsArray.length =" + resourceResultsArray.length);
                var row = 1;
                resourceResultsArray.forEach(function(element) {
                    db.resource.create({
                        username: req.body.username,
                        scenarioID: req.body.scenarioID,
                        userLoginSessionID: req.body.userLoginSessionID,
                        ResourceID: element[0],
                        Name: element[1],
                        Pool: element[2],
                        Shift: element[3],
                        MaximumQuantity: element[4],
                        MinimumAllocationQuantity: element[5],
                        AvailableQuantity: element[6],
                        Costperunittime: element[7],
                        Costtimeunit: element[8],
                        Costperuse: element[9],
                        InitialStatus: element[10],
                        Status: element[11],
                        StatusStartTime: element[12],
                        PendingStatus: element[13],
                        PendingStatusStartTime: (element[14] === "") ? null : element[14],
                        ResourceOrderID: element[15],
                        ReassignedResourceOrderID: element[16],
                        SkillLevel: (element[17] === "") ? null : element[17],
                        Rank: (element[18] === "") ? null : element[18],
                        Shareable: element[19],
                        SharedCount: element[20],
                        TBF: (element[21] === "") ? null : element[21],
                        TTR: (element[22] === "") ? null : element[22],
                        TBFTTRDownInterruptionPolicy: element[23],
                        FailureProgressType: element[24],
                        OffShift: element[25],
                        ScheduledDown: element[26],
                        UnscheduledDown: element[27],
                        Failed: element[28],
                        TotalOrdersServiced: element[29],
                        TotalIdleTime: element[30],
                        TotalBusyTime: element[31],
                        TotalBusyOffShiftTime: element[32],
                        TotalReservedTime: element[33],
                        TotalDownTime: element[34],
                        TotalOffShiftTime: element[35],
                        TotalDisabledTime: element[36],
                        TotalAllocatedTime: element[37],
                        TotalCost: element[38],
                        TotalFailedTime: element[39],
                        TotalQuantityAllocated: element[40],
                        TotalQuantityAllocationTime: element[41],
                        TotalReassignedTime: element[42],
                        TotalScheduledDownTime: element[43],
                        TotalUnscheduledDownTime: element[44],
                        QuantityUtilization: element[45],
                        Utilization: element[46],                 
                    });
                });
                return res.json({resourceResults: resourceResults});     
            });    
        });
    },
    getresourceresultsstream: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/ReceiveDataTableESdataStream2";
        var myheaders = { 
            accept: "application/json", 
            }; 
        var scenarioResults;
        console.log("getresourceresultsstream: Getting resource results from server for userSessionID=" + req.body.userLoginSessionID);
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
            resourceResults = response.data;
            console.log("getresourceresultsstream: response=" + response.data);
            db.scenario.update({
                scenarioCompletionDateTime: new Date(),
            }, {
                where: {
                    userLoginSessionID: req.body.userLoginSessionID
                }
            }).then(function(dbresponse) {
                var myResult = JSON.stringify(resourceResults);
                console.log("MyResult=" + myResult);
                var textArr = myResult.split(/\r\n|\r|\n/g);
                console.log("textArr.length =" + textArr.length);
                var resourceResultsArray = resourceResults.split('\r\n').map(function(ln){
                    return ln.split('\t');
                });
                // Remove last empty element from array
                resourceResultsArray.pop();
                console.log("resourceResultsArray.length =" + resourceResultsArray.length);
                var row = 1;
                resourceResultsArray.forEach(function(element, index) {
                    db.resource.create({
                        username: req.body.username,
                        scenarioID: req.body.scenarioID,
                        userLoginSessionID: req.body.userLoginSessionID,
                        ResourceID: element[0],
                        Name: element[1],
                        Pool: element[2],
                        Shift: element[3],
                        MaximumQuantity: element[4],
                        MinimumAllocationQuantity: element[5],
                        AvailableQuantity: element[6],
                        Costperunittime: element[7],
                        Costtimeunit: element[8],
                        Costperuse: element[9],
                        InitialStatus: element[10],
                        Status: element[11],
                        StatusStartTime: element[12],
                        PendingStatus: element[13],
                        PendingStatusStartTime: (element[14] === "") ? null : element[14],
                        ResourceOrderID: element[15],
                        ReassignedResourceOrderID: element[16],
                        SkillLevel: (element[17] === "") ? null : element[17],
                        Rank: (element[18] === "") ? null : element[18],
                        Shareable: element[19],
                        SharedCount: element[20],
                        TBF: (element[21] === "") ? null : element[21],
                        TTR: (element[22] === "") ? null : element[22],
                        TBFTTRDownInterruptionPolicy: element[23],
                        FailureProgressType: element[24],
                        OffShift: element[25],
                        ScheduledDown: element[26],
                        UnscheduledDown: element[27],
                        Failed: element[28],
                        TotalOrdersServiced: element[29],
                        TotalIdleTime: element[30],
                        TotalBusyTime: element[31],
                        TotalBusyOffShiftTime: element[32],
                        TotalReservedTime: element[33],
                        TotalDownTime: element[34],
                        TotalOffShiftTime: element[35],
                        TotalDisabledTime: element[36],
                        TotalAllocatedTime: element[37],
                        TotalCost: element[38],
                        TotalFailedTime: element[39],
                        TotalQuantityAllocated: element[40],
                        TotalQuantityAllocationTime: element[41],
                        TotalReassignedTime: element[42],
                        TotalScheduledDownTime: element[43],
                        TotalUnscheduledDownTime: element[44],
                        QuantityUtilization: element[45],
                        Utilization: element[46],                 
                    })
                    .then(function(dbcreateresponse) {
                        if ((resourceResultsArray.length - 1) === index) {
                            return res.json({resourceResults: resourceResults});     
                        }
                    });
                });
                // return res.json({resourceResults: resourceResults});     
            });    
        });
    },
    getresourcedata: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerFileStream";
        var myheaders = { 
            accept: "application/json", 
            }; 
        console.log("getresourcedata: Querying database for username=" + req.body.username);
        db.resource.findAll({
            where: {
                scenarioID: req.body.scenarioID,
                username: req.body.username
            },
            order: [
                ['ResourceID', 'ASC']
                // ['totalWaitTime', 'DESC']
            ],
          }).then(function(dbresponse) {
            console.log("Response=" + dbresponse);
            return res.json({resourceData: dbresponse});     
        });    
    },
    getpoolresults: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerFileStream";
        var myheaders = { 
            accept: "application/json", 
            }; 
        var poolResults;
        console.log("getpoolresults: Getting pool results from server for filepathname=" + req.body.filepathname);
        return axios({
            url: queryURL,
            method: 'post',
            accept : "application/json",
            // contentType: "application/octet-stream",
            responseType: "blob",
            headers : myheaders,
            muteHttpExceptions : false,
            params: 
            {
                filename: req.body.filepathname
            }
        }).then(function(response) {
            poolResults = response.data;
            console.log("ExtendSimASPgetpoolResults: response=" + response.data);
            var myResult = JSON.stringify(poolResults);
            console.log("MyResult=" + myResult);
            var textArr = myResult.split(/\r\n|\r|\n/g);
            console.log("textArr.length =" + textArr.length);
            var poolResultsArray = poolResults.split('\r\n').map(function(ln){
                return ln.split('\t');
            });
            // Remove last empty element from array
            poolResultsArray.pop();
            console.log("poolResultsArray.length =" + poolResultsArray.length);
            var row = 1;
            poolResultsArray.forEach(function(element) {
                db.pool.create({
                    username: req.body.username,
                    scenarioID: req.body.scenarioID,
                    userLoginSessionID: req.body.userLoginSessionID,
                    Name: (element[0] === "") ? null : element[0],
                    parentID: (element[1] === "") ? null : element[1],
                    ResourcePoolBlock: (element[2] === "") ? null : element[2],
                    AutogenerateResources: (element[3] === "") ? null : element[3],
                    Costperunittime: (element[4] === "") ? null : element[4],
                    Costperuse: (element[5] === "") ? null : element[5],
                    Costtimeunit: (element[6] === "") ? null : element[6],
                    InitialStatus: (element[7] === "") ? null : element[7],
                    InitialResources: (element[8] === "") ? null : element[8],
                    TotalResources: (element[9] === "") ? null : element[9],
                    IdleResources: (element[10] === "") ? null : element[10],
                    BusyResources: (element[11] === "") ? null : element[11],
                    ReservedResources: (element[12] === "") ? null : element[12],
                    DownResources: (element[13] === "") ? null : element[13],
                    DisabledResources: (element[14] === "") ? null : element[14],
                    AllocatedResources: (element[15] === "") ? null : element[15],
                    AvailableQuantity: (element[16] === "") ? null : element[16],
                    Failed: (element[17] === "") ? null : element[17],
                    FailedResources: (element[18] === "") ? null : element[18],
                    FailureProgressType: (element[19] === "") ? null : element[19],
                    HasDistinctResources: (element[20] === "") ? null : element[20],
                    MaximumQuantity: (element[21] === "") ? null : element[21],
                    MinimumAllocationQuantity: (element[22] === "") ? null : element[22],
                    OffShift: (element[23] === "") ? null : element[23],
                    OffShiftResources: (element[24] === "") ? null : element[24],
                    ReassignedResources: (element[25] === "") ? null : element[25],
                    ScheduledDown: (element[26] === "") ? null : element[26],
                    ScheduledDownResources: (element[27] === "") ? null : element[27],
                    Shareable: (element[28] === "") ? null : element[28],
                    SharedCount: (element[29] === "") ? null : element[29],
                    Shift: (element[30] === "") ? null : element[30],
                    TBF: (element[31] === "") ? null : element[31],
                    TBFTTRDownInterruptionPolicy: (element[32] === "") ? null : element[32],
                    TTR: (element[33] === "") ? null : element[33],
                    UnscheduledDown: (element[34] === "") ? null : element[34],
                    UnscheduledDownResources: (element[35] === "") ? null : element[35],
                    TotalOrdersServiced: (element[36] === "") ? null : element[36],
                    TotalIdleTime: (element[37] === "") ? null : element[37],
                    TotalBusyTime: (element[38] === "") ? null : element[38],
                    TotalBusyOffShiftTime: (element[39] === "") ? null : element[39],
                    TotalReservedTime: (element[40] === "") ? null : element[40],
                    TotalDownTime: (element[41] === "") ? null : element[41],
                    TotalOffShiftTime: (element[42] === "") ? null : element[42],
                    TotalDisabledTime: (element[43] === "") ? null : element[43],
                    QuantityUtilization: (element[44] === "") ? null : element[44],
                    TotalAllocatedTime: (element[45] === "") ? null : element[45],
                    TotalCost: (element[46] === "") ? null : element[46],
                    TotalFailedTime: (element[47] === "") ? null : element[47],
                    TotalQuantityAllocated: (element[48] === "") ? null : element[48],                 
                    TotalQuantityAllocationTime: (element[49] === "") ? null : element[49],                 
                    TotalReassignedTime: (element[50] === "") ? null : element[50],                 
                    TotalScheduledDownTime: (element[51] === "") ? null : element[51],                 
                    TotalUnscheduledDownTime: (element[52] === "") ? null : element[52],                 
                    Utilization: (element[53] === "") ? null : element[53],                 
                });
            });
            return res.json({poolResults: poolResults});     
        });    
    },
    getpoolresultsstream: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/ReceiveDataTableESdataStream2";
        var myheaders = { 
            accept: "application/json", 
            }; 
        var scenarioResults;
        console.log("getpoolresultsstream: Getting pool results from server for userSessionID=" + req.body.userLoginSessionID);
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
            poolResults = response.data;
            console.log("ExtendSimASPgetpoolResults: response=" + response.data);
            var myResult = JSON.stringify(poolResults);
            console.log("MyResult=" + myResult);
            var textArr = myResult.split(/\r\n|\r|\n/g);
            console.log("textArr.length =" + textArr.length);
            var poolResultsArray = poolResults.split('\r\n').map(function(ln){
                return ln.split('\t');
            });
            // Remove last empty element from array
            poolResultsArray.pop();
            console.log("poolResultsArray.length =" + poolResultsArray.length);
            var row = 1;
            poolResultsArray.forEach(function(element, index) {
                db.pool.create({
                    username: req.body.username,
                    scenarioID: req.body.scenarioID,
                    userLoginSessionID: req.body.userLoginSessionID,
                    Name: (element[0] === "") ? null : element[0],
                    parentID: (element[1] === "") ? null : element[1],
                    ResourcePoolBlock: (element[2] === "") ? null : element[2],
                    AutogenerateResources: (element[3] === "") ? null : element[3],
                    Costperunittime: (element[4] === "") ? null : element[4],
                    Costperuse: (element[5] === "") ? null : element[5],
                    Costtimeunit: (element[6] === "") ? null : element[6],
                    InitialStatus: (element[7] === "") ? null : element[7],
                    InitialResources: (element[8] === "") ? null : element[8],
                    TotalResources: (element[9] === "") ? null : element[9],
                    IdleResources: (element[10] === "") ? null : element[10],
                    BusyResources: (element[11] === "") ? null : element[11],
                    ReservedResources: (element[12] === "") ? null : element[12],
                    DownResources: (element[13] === "") ? null : element[13],
                    DisabledResources: (element[14] === "") ? null : element[14],
                    AllocatedResources: (element[15] === "") ? null : element[15],
                    AvailableQuantity: (element[16] === "") ? null : element[16],
                    Failed: (element[17] === "") ? null : element[17],
                    FailedResources: (element[18] === "") ? null : element[18],
                    FailureProgressType: (element[19] === "") ? null : element[19],
                    HasDistinctResources: (element[20] === "") ? null : element[20],
                    MaximumQuantity: (element[21] === "") ? null : element[21],
                    MinimumAllocationQuantity: (element[22] === "") ? null : element[22],
                    OffShift: (element[23] === "") ? null : element[23],
                    OffShiftResources: (element[24] === "") ? null : element[24],
                    ReassignedResources: (element[25] === "") ? null : element[25],
                    ScheduledDown: (element[26] === "") ? null : element[26],
                    ScheduledDownResources: (element[27] === "") ? null : element[27],
                    Shareable: (element[28] === "") ? null : element[28],
                    SharedCount: (element[29] === "") ? null : element[29],
                    Shift: (element[30] === "") ? null : element[30],
                    TBF: (element[31] === "") ? null : element[31],
                    TBFTTRDownInterruptionPolicy: (element[32] === "") ? null : element[32],
                    TTR: (element[33] === "") ? null : element[33],
                    UnscheduledDown: (element[34] === "") ? null : element[34],
                    UnscheduledDownResources: (element[35] === "") ? null : element[35],
                    TotalOrdersServiced: (element[36] === "") ? null : element[36],
                    TotalIdleTime: (element[37] === "") ? null : element[37],
                    TotalBusyTime: (element[38] === "") ? null : element[38],
                    TotalBusyOffShiftTime: (element[39] === "") ? null : element[39],
                    TotalReservedTime: (element[40] === "") ? null : element[40],
                    TotalDownTime: (element[41] === "") ? null : element[41],
                    TotalOffShiftTime: (element[42] === "") ? null : element[42],
                    TotalDisabledTime: (element[43] === "") ? null : element[43],
                    QuantityUtilization: (element[44] === "") ? null : element[44],
                    TotalAllocatedTime: (element[45] === "") ? null : element[45],
                    TotalCost: (element[46] === "") ? null : element[46],
                    TotalFailedTime: (element[47] === "") ? null : element[47],
                    TotalQuantityAllocated: (element[48] === "") ? null : element[48],                 
                    TotalQuantityAllocationTime: (element[49] === "") ? null : element[49],                 
                    TotalReassignedTime: (element[50] === "") ? null : element[50],                 
                    TotalScheduledDownTime: (element[51] === "") ? null : element[51],                 
                    TotalUnscheduledDownTime: (element[52] === "") ? null : element[52],                 
                    Utilization: (element[53] === "") ? null : element[53],                 
                })
                .then(function(dbcreateresponse) {
                    if ((poolResultsArray.length - 1) === index) {
                        return res.json({poolResults: poolResults});     
                    }
                });
        });
            // return res.json({poolResults: poolResults});     
        });    
    },
    getpooldata: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerFileStream";
        var myheaders = { 
            accept: "application/json", 
            }; 
        console.log("getresourcedata: Querying database for username=" + req.body.username);
        db.pool.findAll({
            where: {
                scenarioID: req.body.scenarioID,
                username: req.body.username
            },
            order: [
                ['Name', 'ASC']
                // ['totalWaitTime', 'DESC']
            ],
          }).then(function(dbresponse) {
            console.log("Response=" + dbresponse);
            return res.json({poolData: dbresponse});     
        });    
    },
    getuserscenarios: function(req, res) {
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerFileStream";
        var myheaders = { 
            accept: "application/json", 
            }; 
        db.scenario.findAll({
            where: {
                username: req.body.username
            }
          }).then(function(dbresponse) {
              console.log("Response=" + dbresponse[0].userLoginSessionID + " length=" + dbresponse.length);         
                return res.json({userScenarios: dbresponse});     
            })
            .catch(function(error) {
                return res.json({error: 'No user scenarios'}); 
            }); 
    },
    deletescenario: function(req, res) {
        console.log('deletescenario: deleting scenarioID=' + req.body.scenarioID + ' for username=' + req.body.username);
        db.scenario.destroy({
            where: {
            username: req.body.username,
            scenarioID: req.body.scenarioID
            }
        })
        .then(function(dbresponse) {
            db.cycletime.destroy({
                where: {
                username: req.body.username,
                scenarioID: req.body.scenarioID
                }
            })
            .then(function(dbresponse2) {
                db.resource.destroy({
                    where: {
                    username: req.body.username,
                    scenarioID: req.body.scenarioID
                    }
                })
                .then(function(dbresponse3) {
                    return res.json({dbresponse: dbresponse,
                                     dbresponse2: dbresponse2,
                                     dbresponse3: dbresponse3});     
                })
            })
        });   
    }
};
