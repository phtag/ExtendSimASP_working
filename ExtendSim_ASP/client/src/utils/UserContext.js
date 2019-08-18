import React from 'react';
import API from './API';
import ReactTable from 'react-table';
import pixelWidth from 'string-pixel-width';

const Context = React.createContext();
const AdvancedResources_dBname = "Advanced Resources";
const CycleTimeResults_tableName = "Cycle Time Results";  
const Resources_tableName = "Resources";
const Pools_tableName = "Pools"
const defaultDatabaseSelectionLabel = 'Select a database...';
const defaultTableSelectionLabel = 'Select a table...';

var checkModelStatusTimer;
const runInProcessScenarioStatus = 2;
const runCompletedScenarioStatus = 3;
const dropdownMenuIconPixels = 22;
const c_completiondate_scenarioUpdateType = "completiondate";
const c_resultsArchived_scenarioUpdateType = "resultsarchived";
const scenarioInputsSourceFilesRowObject = {
    file: '',
    viewFile: false,
    showFile: '',
  };

  const scenarioInputsTableDataRowObject = {
    file: '',
    viewFile: false,
    showFile: '',
    databasename: defaultDatabaseSelectionLabel,
    tablename: defaultTableSelectionLabel,
    viewTable: false,
    showTable: '',
    tablefields: [],
    tableRows: [],
    databases: [],
    tables: [],
  };

export class UserProvider extends React.Component {
  constructor(props) {
    super(props);
    this.setColumnWidth = this.setColumnWidth.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleDialogFactorFiltersModal = this.toggleDialogFactorFiltersModal.bind(this);
    this.renderModalTable = this.renderModalTable.bind(this);
    this.handleShowScenarioResults = this.handleShowScenarioResults.bind(this);

  this.state = {
    currentUser: null,
    username: "",
    password: "",
    reenteredpassword: "",
    activationkey: "",
    pathname: "/scenario-setup",
    webpage: "",
    history: null,
    error: "",
    errorSignupPage: "",
    errorLoginPage: "",
    userLoginSessionID: "",
    scenarioRunStatus: "N/A",
    showModalTable: false,
    showModalDialogFactorsFilters: false,
    loadingTableData: false,
    showDialogVariableFactorsTable: false,
    showDatabaseTargetsTable: false,
    showSetDialogParameterValuesTable: false,
    currentSourceFileTarget:  'scenariofolder',
    dialogVariableFilterRows: [
      {
        dialogvariablename: "",
        blockname: "",
        blocklabel: "",
        blocknumber: -1,
        enclosinghblocknumber: -1
      }
    ],
    dialogVariableFilterColumns: [
      {
        Header: 'Dialog Variable Name',
        accessor: 'dialogvariablename',
        resizable: true,
        style: {
          'font': 'arial',
          'fontSize': 16,
          'textAlign': 'left'
          },
        Cell: props => ( 
          <select 
            style={{width: this.setCellColumnWidth(this.state.dialogVariableFilterRows[props.index].dialogvariablename, 'arial', 'Dialog Variable Name', 16)}}
            value={this.state.dialogVariableFilterRows[props.index].dialogvariablename}
            onChange={event => this.handleDialogVariableChange(props, event)}>
            <option value="">Select a dialog variable...</option>
            {this.state.dialogvariablenames.map((variablename, index) => {
              return (<option key={variablename.name} value={variablename.name} defaultValue={variablename.name===this.state.dialogVariableFilterRows[props.index].dialogvariablename? 'selected' : ''}>{variablename.name}</option>)})
            }
          </select>
        )
      }
    ],
    pageData: [ 
      { 
        name: "Signup",
        shouldUpdate: true
      },
      { 
        name: "Login",
        shouldUpdate: true
      },
      { 
        name: "Scenario-Setup",
        shouldUpdate: true
      },
      { 
        name: "Scenarios-Summary",
        shouldUpdate: true
      }
    ],
    validationObjects: [
      {
        name: "signupSubmitButton",
        enabled: false
      },
      {
        name: "loginSubmitButton",
        enabled: false
      },
      {
        name: "SubmitScenarioButton",
        enabled: false
      },
      {
        name: "ShowResultsButton",
        enabled: false
      },
      {
        name: "Signup-navbar-option",
        enabled: true      
      },
      {
        name: "Login-navbar-option",
        enabled: true      
      },
      {
        name: "Scenario-navbar-option",
        enabled: false      
      },
      {
        name: "Results-navbar-option",
        enabled: false      
      }
    ],
    scenarioResultTypes: [
      {
        type: "Cycle-times",
        filename: "/Cycle Time Results.txt"
      },
      {
        type: "Resources",
        filename: "/Resources.txt"
      },
      {
        type: "Pools",
        filename: "/pools.txt"
      },
      {
        type: "Model",
        filename: "/Model Results.txt"
      }
    ],
    scenarioSetupTable: 
    {
      columnWidths: [100, 50, 100, 100, 50]
    },
    testWidth: 50,
    currentSelectedExtendSimModel: {
      OriginalPath: "",
      FullPath: "",
      directory: "",
      modelInfoDatabasename: "",
      modelInfoTablename: "",
      currentDatabase: "",
      databaseOptionItems: "",
      currentSelectedTableRow: -1,
      modelInfo: [
        {
          variableName: "",
          dialogItemType: "",
          blockName: "",
          blockNumber: -1,
          tabname: "",
          blockLabel: "",
          enclosingHblockNumber: -1,
          enclosingHblockLabel: ""
        }
      ],
      dialogVariableFactorsRows: [
        {
          factorName: '',
          factorValue: '',
          variableName: '',
          blockLabel: '',
          tabName: ''
        }
      ],
      dialogVariableFactorsColumns: [
        {
          Header: 'Factor Name',
          accessor: 'factorName',
          id: 'factorname_etxt',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          Cell: props => 
            <input 
              value={this.state.currentSelectedExtendSimModel.dialogVariableFactorsRows[props.index].factorName}
              onChange={(event) => this.onEditableTableCellChange(event, props)} 
            />,
            resizable: true
        },
        {
          Header: 'Factor Value',
          accessor: 'factorValue',
          id: 'factorvalue_etxt',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          Cell: props => 
          <input  
            value={this.state.currentSelectedExtendSimModel.dialogVariableFactorsRows[props.index].factorValue}
            onChange={(event) => this.onEditableTableCellChange(event, props)} 
          />,
          resizable: true
        },
        {
          Header: 'Filters',
          id: 'filters_btn',
          accessor: 'filters',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          Cell: props => ( 
            <button 
              disabled={this.state.currentSelectedExtendSimModel.FullPath===''}
              onClick={event => this.toggleDialogFactorFiltersModal(event, props)}>Set filters</button>
          ),
          resizable: true
        },
        {
          Header: 'Variable Name',
          accessor: 'variableName',
          id: 'variablename_txt',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          resizable: true
        },
        {
          Header: 'Block Name',
          accessor: 'variableName',
          id: 'blockname_txt',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          resizable: true
        },
        {
          Header: 'Block Label',
          accessor: 'blockLabel',
          id: 'blocklabel_txt',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          resizable: true
        },
        {
          Header: 'Tab Name',
          accessor: 'tabName',
          id: 'tabname_txt',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          resizable: true
        },
      ],
      scenarioInputsSourceFileRows: [
        scenarioInputsSourceFilesRowObject
      ],
      scenarioInputsSourceFileColumns: [
        {
          Header: 'Source File',
          accessor: 'file',
          id: 'sourcefile_txt',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          resizable: true
        },
        {
          Header: 'View File',
          accessor: 'showFile',
          id: 'viewfile_btn',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'center'
          },
          resizable: true,
          Cell: props => ( 
            <button 
              disabled={!this.state.currentSelectedExtendSimModel.scenarioInputsSourceFileRows[props.index].viewFile}
              onClick={event => this.toggleModal(props, event)}>View</button>
          )
        },
      ],
      scenarioInputsTableData: [
        scenarioInputsTableDataRowObject
      ],
      scenarioInputsTableColumns: [
        {
          Header: 'Source File',
          accessor: 'file',
          id: 'sourcefile_txt',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
          resizable: true
        },
        {
          Header: 'View File',
          accessor: 'showFile',
          id: 'viewfile_btn',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'center'
          },
          resizable: true,
          Cell: props => ( 
            <button 
              disabled={!this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].viewFile}
              onClick={event => this.toggleModal(props, event)}>View</button>
          )
        },
        {
          Header: 'Target Database',
          accessor: 'databasename',
          id: 'targetdatabase_drop',
          resizable: true,
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
            },
          Cell: props => ( 
            <select 
              style={{width: this.setCellColumnWidth(this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].databasename, 'arial', 'Target Database', 16)}}
              value={this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].databasename}
              onChange={event => this.handleDatabaseDropdownChange(props, event)}>
              <option value="">Select a database...</option>
              {this.state.currentSelectedExtendSimModel.databases.map((myDatabase, index) => {
                return (<option key={myDatabase.name} value={myDatabase.name} defaultValue={myDatabase.name===this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].databasename? 'selected' : ''}>{myDatabase.name}</option>)})
                // <option key={database.name} value={database.name} selected={(database.name===this.state.currentSelectedExtendSimModel.scenarioInputsTableData[index].databasename? 'selected' : '')}>{database.name}</option>
              }
            </select>
          )
        },
        {
          Header: 'Target Table',
          accessor: 'tablename',
          id: 'targettable_drop',
          resizable: true,
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'left'
          },
            // this.state.currentSelectedExtendSimModel.scenarioInputsTableData, 'targettable', 'Target Table'),
          Cell: props => ( 
            <select
              key={this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tablename}
              style={{width: this.setCellColumnWidth(this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tablename, 'arial', 'Target Table', 16)}}
              value={this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tablename}
              onChange={event => this.handleTableDropdownChange(props, event)}> */}
              <option value="">Select a table...</option>
              {this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tables.map((myTable, index) => {
                return (<option key={index} value={myTable.name}>{myTable.name}</option>)})
              }
            </select>
          )
        },
        {
          Header: 'View Table',
          accessor: 'showTable',
          id: 'viewtable_btn',
          style: {
            'font': 'arial',
            'fontSize': 16,
            'textAlign': 'center'
          },
          resizable: true,
          Cell: props => ( 
            <button 
              disabled={!this.state.currentSelectedExtendSimModel.scenarioInputsTableData[props.index].viewTable}
              onClick={event => this.toggleModal(props, event)}>View</button>
          )
        },
      ],  
      databases: [
        {
          name: "",
          tables: [
            {
              name: "",
              fields: [
                {
                  name: "",
                  dataType: ""
                }
              ]
            }
          ]
        }
      ]
    },
    userExtendSimServerModels: [],
    ExtendSimModels: [
      {
        name: "ASP example model (GS).mox",
        description: "ARM resource process model (deterministic)"
      },
      {
        name: "ASP final project-v1.mox",
        description: "ARM resource process model (stochastic)"
      }
    ],
    modelname: "",
    cycleTimeResultsFilename: "/Cycle Time Results.txt",
    scenarioName: "",
    scenarioID: -1,
    scenarioFolderPathname: "",
    scenarioInputFiles_stream: [],
    scenarioInputFiles_text: [],
    userScenarios: [],
    currentScenarioRowIndex: -1,
    cycleTimeData: [],
    resourceData: [],
    poolData: [],
    modelData: [],
    resourceChartDataSeries1: [],
    resourceChartDataSeries2: [],    
    cycleTimeChartData: {
      totalJobsProcessed: [],
      totalProcessTime: [],
      totalWaitTime: [],
      avgProcessTime: [], 
      avgWaitTime: [],
      avgCycleTime: [],
      CoVarrivals: [],
      CoVdepartures: []
    },
    resourceChartData: {
      TotalOrdersServiced: [],
      TotalIdleTime: [],
      TotalBusyTime: [],
      TotalBusyOffShiftTime: [],
      TotalReservedTime: [],
      TotalDownTime: [],
      TotalOffShiftTime: [],
      TotalDisabledTime: [],
      TotalAllocatedTime: [],
      TotalCost: [],
      TotalFailedTime: [],
      TotalQuantityAllocated: [],
      TotalQuantityAllocationTime: [],
      TotalReassignedTime: [],
      TotalScheduledDownTime: [],
      TotalUnscheduledDownTime: [],
      QuantityUtilization: [],
      Utilization: []
    },
    poolChartData: {
      TotalOrdersServiced: [],
      TotalIdleTime: [],
      TotalBusyTime: [],
      TotalBusyOffShiftTime: [],
      TotalReservedTime: [],
      TotalDownTime: [],
      TotalOffShiftTime: [],
      TotalDisabledTime: [],
      TotalAllocatedTime: [],
      TotalCost: [],
      TotalFailedTime: [],
      TotalQuantityAllocated: [],
      TotalQuantityAllocationTime: [],
      TotalReassignedTime: [],
      TotalScheduledDownTime: [],
      TotalUnscheduledDownTime: [],
      QuantityUtilization: [],
      Utilization: []
    },
    chartProperties: {
      axesLabelFontSize: 24,
      titleFontSize: 30
    }
  }
}
  chartReference = {};
// Utilities

  onEditableTableCellChange = (event, props) => {
    event.preventDefault();
    const { currentSelectedExtendSimModel } = this.state;
    const rowIndex = props.row._index;
    const columnID = props.column.id;
    console.log(JSON.stringify(props.column));
    var rowObject = currentSelectedExtendSimModel.dialogVariableFactorsRows[rowIndex];
    rowObject[columnID] = event.target.value;
    currentSelectedExtendSimModel.dialogVariableFactorsRows[rowIndex] = rowObject;
    this.setState({ currentSelectedExtendSimModel: currentSelectedExtendSimModel },
          this.renderDialogVariableFactorsTable);

  }
  toggleDialogVariableFactorsTable = (event, props) => {
    event.preventDefault();
    const {showDialogVariableFactorsTable, currentSelectedExtendSimModel} = this.state;
    this.setState(
      { loadingTableData: true },
      () => API.getmodelinfo(currentSelectedExtendSimModel.FullPath, true)
      .then(res => {
        API.getdtabasetablecontentsstream(currentSelectedExtendSimModel.FullPath,
                                          res.data.ModelInfo.Databasename, 
                                          res.data.ModelInfo.Tablename)
        .then(res1 => {
          console.log(JSON.stringify(res1.data.tableDataArray));
          res1.data.tableDataArray.forEach(function(elements, index) {
            currentSelectedExtendSimModel.modelInfo.push(
            {
              variableName: elements[0],
              dialogItemType: elements[1],
              blockName: elements[2],
              blockNumber: elements[3],
              tabname: elements[4],
              blockLabel: elements[5],
              enclosingHblockNumber: elements[6],
              enclosingHblockLabel: elements[7],  
            });
          })
          this.setState(
          { 
            currentSelectedExtendSimModel: currentSelectedExtendSimModel,
            showDialogVariableFactorsTable: !showDialogVariableFactorsTable,
            modelInfoDatabasename: res.data.ModelInfo.Databasename,
            modelInfoTablename: res.data.ModelInfo.Tablename,
            loadingTableData: false
          });
        })
      })
    );
  }
  toggleDatabaseTargetsTable = (event) => {
    event.preventDefault();
    const {showDatabaseTargetsTable} = this.state;
    this.setState({ showDatabaseTargetsTable: !showDatabaseTargetsTable })
  }
  toggleSetDialogParameterValuesTable = (event) => {
    event.preventDefault();
    const {showSetDialogParameterValuesTable} = this.state;
    this.setState({ showSetDialogParameterValuesTable: !showSetDialogParameterValuesTable })
  }
  toggleModal (props, event) {
    event.preventDefault();
    var { showModalTable , currentSelectedExtendSimModel } = this.state;
    if (props.row !== undefined) {
      currentSelectedExtendSimModel.currentSelectedTableRow = props.row._index;
      const modelpath = currentSelectedExtendSimModel.FullPath;
      const databasename = currentSelectedExtendSimModel.scenarioInputsTableData[props.row._index].databasename;
      const tablename = currentSelectedExtendSimModel.scenarioInputsTableData[props.row._index].tablename;
      currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tableRows = [];
      API.getdtabasetablecontentsstream(modelpath,
                                        databasename, 
                                        tablename)
      .then(res => {
        console.log('handleDatabaseTableView - tableData=' + JSON.stringify(res.data));
        res.data.tableDataArray.forEach(function(row) {
          currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tableRows.push(row);
        })
        this.setState({ showModalTable: !showModalTable,
          currentSelectedExtendSimModel: currentSelectedExtendSimModel });  
        });  
    }
    else {
      this.setState({ showModalTable: !showModalTable,
        currentSelectedExtendSimModel: currentSelectedExtendSimModel });
      }
  }

  toggleDialogFactorFiltersModal (event, props) {
    event.preventDefault();
    var { showModalDialogFactorsFilters , currentSelectedExtendSimModel } = this.state;
    this.setState({ showModalDialogFactorsFilters: !showModalDialogFactorsFilters,
                    currentSelectedExtendSimModel: currentSelectedExtendSimModel });
  }
  setCellColumnWidth(cellValue, headerText, font, fontSize) {
    var referenceText;
    if (cellValue.length > headerText.length) {
      referenceText = cellValue;
    } else {
      referenceText = headerText;
    }

    var columnWidth = pixelWidth(referenceText, { font: 'arial', size: fontSize }) + dropdownMenuIconPixels;
    return columnWidth;
  }

  setColumnWidth(rows, headerText, key, id, font, fontSize) {
      // This function calculates the column width for a list of tables in a React table of data
    var referenceText;
    var columnWidth;

    rows.forEach(function(row) {
      if ((row[key].length) > headerText.length) {
        referenceText = row[key];
      } else {
        referenceText= headerText;
      }
    });

    if (id.indexOf('_drop') > 0) {
      columnWidth = pixelWidth(referenceText, { size: fontSize }) + dropdownMenuIconPixels + 20;
    } else {
      columnWidth = pixelWidth(referenceText, { size: fontSize }) + 20;
    }
    return columnWidth;
  }

  getColumnWidth = (rows, accessor, headerText) => {
    const maxWidth = 400
    const magicSpacing = 10
    const cellLength = Math.max(
      ...rows.map(row => (`${row[accessor]}` || '').length),
      headerText.length,
    )
    return Math.min(maxWidth, cellLength * magicSpacing)
  }
  
  setUserSelectedExtendSimModel(modelpath) {
    var pos = modelpath.lastIndexOf("\\");
      var directory = modelpath.substr(0,pos);
      var OriginalPath = modelpath.substr(pos+1,modelpath.length-1);
      var selectedExtendSimModel = {
        OriginalPath: OriginalPath,
        FullPath: modelpath,
        directory: directory
      }
      return selectedExtendSimModel;
  }
  getMatchingScenario = (scenarioID) => {
    console.log(this.state.userScenarios[0].scenarioID);
    for (var i=0;i<this.state.userScenarios.length;i++) {
      if (this.state.userScenarios[i].scenarioID === scenarioID) {
        return this.state.userScenarios[i];
      }
    }
    return null;
  }

  getUserScenarios = (webPage) => {
    var userScenarios = [];
    API.getUserScenarios(this.state.username)
    .then(res => {
      if (res.data.userScenarios === undefined) {
      } else {
        userScenarios = res.data.userScenarios;
      }
      this.setState({userScenarios: userScenarios,
                    webPage: webPage});
    })
  }

  makeCycleTimeChartData = (cycleTimeData, dataType) => {
    const dataRow = [];
    cycleTimeData.map((rowData, key) => {
      const {
              stepname,
              totalJobsProcessed, 
              totalProcessTime, 
              totalWaitTime,
              avgProcessTime,
              avgWaitTime,
              avgCycleTime,
              CoVarrivals,
              CoVdepartures
            } = rowData; //destructuring
      var value;
  
      switch (dataType) {
        case 'totalJobsProcessed':
          value = totalJobsProcessed;
          break;

        case 'totalProcessTime':
          value = totalProcessTime;
          break;

        case 'totalWaitTime':
          value = totalWaitTime;
          break;

        case 'avgProcessTime':
          value = avgProcessTime;
          break;

        case 'avgWaitTime':
          value = avgWaitTime;
          break;

        case 'avgCycleTime':
          value = avgCycleTime;
          break;

        case 'CoVarrivals':
          value = CoVarrivals;
          break;
        
        case 'CoVdepartures':
          value = CoVdepartures;
          break; 

        default:
          value = '';
          break;    
        }
        dataRow.push({"value": value, "label": stepname });
        return true;
    });
    return dataRow;
  }

  makeResourceChartData = (resourceData, dataType) => {
    const dataRow = [];
    resourceData.map((rowData, key) => {
      const {
            ResourceID,
            TotalOrdersServiced,
            TotalIdleTime,
            TotalBusyTime,
            TotalBusyOffShiftTime,
            TotalReservedTime,
            TotalDownTime,
            TotalOffShiftTime,
            TotalDisabledTime,
            TotalAllocatedTime,
            TotalCost,
            TotalFailedTime,
            TotalQuantityAllocated,
            TotalQuantityAllocationTime,
            TotalReassignedTime,
            TotalScheduledDownTime,
            TotalUnscheduledDownTime,
            QuantityUtilization,
            Utilization
          } = rowData; //destructuring
      var value;
  
      switch (dataType) {
        case 'TotalOrdersServiced':
          value = TotalOrdersServiced;
          break;

        case 'TotalIdleTime':
          value = TotalIdleTime;
          break;

        case 'TotalBusyTime':
          value = TotalBusyTime;
          break;

        case 'TotalReservedTime':
          value = TotalReservedTime;
          break;

        case 'TotalBusyOffShiftTime':
          value = TotalBusyOffShiftTime;
          break;

        case 'TotalDownTime':
          value = TotalDownTime;
          break;
  
        case 'TotalOffShiftTime':
          value = TotalOffShiftTime;
          break;

        case 'TotalDisabledTime':
          value = TotalDisabledTime;
          break;

        case 'TotalAllocatedTime':
          value = TotalAllocatedTime;
          break;

        case 'TotalCost':
          value = TotalCost;
          break;

        case 'TotalFailedTime':
          value = TotalFailedTime;
          break;          

        case 'TotalQuantityAllocated':
          value = TotalQuantityAllocated;
          break;

        case 'TotalQuantityAllocationTime':
          value = TotalQuantityAllocationTime;
          break;
        
        case 'TotalReassignedTime':
          value = TotalReassignedTime;
          break;

        case 'TotalScheduledDownTime':
          value = TotalScheduledDownTime;
          break;
          
        case 'TotalUnscheduledDownTime':
          value = TotalUnscheduledDownTime;
          break;

        case 'QuantityUtilization':
            value = QuantityUtilization;
            break;

        case 'Utilization':
          value = Utilization;
          break;

        default:
          value = '';
          break;             
        }
        dataRow.push({"value": value, "label": ResourceID });
        return true;
    });
    return dataRow;
  }

  makePoolChartData = (poolData, dataType) => {
    const dataRow = [];
    poolData.map((rowData, key) => {
      const {
            Name,
            TotalOrdersServiced,
            TotalIdleTime,
            TotalBusyTime,
            TotalBusyOffShiftTime,
            TotalReservedTime,
            TotalDownTime,
            TotalOffShiftTime,
            TotalDisabledTime,
            TotalAllocatedTime,
            TotalCost,
            TotalFailedTime,
            TotalQuantityAllocated,
            TotalQuantityAllocationTime,
            TotalReassignedTime,
            TotalScheduledDownTime,
            TotalUnscheduledDownTime,
            QuantityUtilization,
            Utilization
          } = rowData; //destructuring
      var value;
  
      switch (dataType) {
        case 'TotalOrdersServiced':
          value = TotalOrdersServiced;
          break;

        case 'TotalIdleTime':
          value = TotalIdleTime;
          break;

        case 'TotalBusyTime':
          value = TotalBusyTime;
          break;

        case 'TotalBusyOffShiftTime':
          value = TotalBusyOffShiftTime;
          break;

        case 'TotalReservedTime':
          value = TotalReservedTime;
          break;

        case 'TotalDownTime':
          value = TotalDownTime;
          break;
  
        case 'TotalOffShiftTime':
          value = TotalOffShiftTime;
          break;

        case 'TotalDisabledTime':
          value = TotalDisabledTime;
          break;

        case 'TotalAllocatedTime':
          value = TotalAllocatedTime;
          break;

        case 'TotalCost':
          value = TotalCost;
          break;

        case 'TotalFailedTime':
          value = TotalFailedTime;
          break;          

        case 'TotalQuantityAllocated':
          value = TotalQuantityAllocated;
          break;

        case 'TotalQuantityAllocationTime':
          value = TotalQuantityAllocationTime;
          break;
        
        case 'TotalReassignedTime':
          value = TotalReassignedTime;
          break;

        case 'TotalScheduledDownTime':
          value = TotalScheduledDownTime;
          break;
          
        case 'TotalUnscheduledDownTime':
          value = TotalUnscheduledDownTime;
          break;

        case 'QuantityUtilization':
            value = QuantityUtilization;
            break;

        case 'Utilization':
          value = Utilization;
          break;

        default:
          value = '';
          break;
              
        }
        return dataRow.push({"value": value, "label": Name });
    });
    return dataRow;
  }

  // Charts

  resetSignupPage = () => {
    this.setState({
                  username: "",
                  password: "",
                  reenteredpassword: "",
                  activationkey: ""}, this.ValidatePageElements);
}
  resetLoginPage = () => {
    this.setState({
                  username: "",
                  password: ""}, this.ValidatePageElements);
  }

// Validation functions
  ValidateScenarioInputFiles_stream = () => {
    const { currentSelectedExtendSimModel, scenarioInputFiles_stream } = this.state;
    if (scenarioInputFiles_stream.length === 0) {
      return true;
    }

    for (var i=0;i<currentSelectedExtendSimModel.scenarioInputsTableData.length;i++) {
      if (currentSelectedExtendSimModel.scenarioInputsTableData.databasename === defaultDatabaseSelectionLabel) {
        return false;
      } else if (currentSelectedExtendSimModel.scenarioInputsTableData.tablename === defaultTableSelectionLabel) {
        return false;
      }
    }
    return true;
  }
  ValidateScenarioInputFiles_text = () => {
    if (this.state.scenarioInputFiles_text.length === 0) {
      return true;
    } else {
      return true;  // for now leave this open ended
    }
  } 
          
  ValidatePageElements = (callback) => {
    // user login data
    var myValidationObjects = this.state.validationObjects;

    const { username, password, reenteredpassword, activationkey, webPage } = this.state;
    if (webPage === 'signup') {
      if (username !== "") {
          if (password !== "") {
              if (reenteredpassword !== "") {
                  if (password === reenteredpassword) {
                      if (activationkey !== "") {
                          myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="signupSubmitButton")].enabled = true;
                          this.setState({validationObjects: myValidationObjects})                 
                      }
                  }               
              }
          }
      } else {
        myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="signupSubmitButton")].enabled = false;
        this.setState({validationObjects: myValidationObjects})                 
      }
    } else if (this.state.webPage ==="login") {
        if ((this.state.username !== "") && (this.state.password !== "")) {
          myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="loginSubmitButton")].enabled = true;
          this.setState({validationObjects: myValidationObjects})
        } else {
          myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="loginSubmitButton")].enabled = false;
          this.setState({validationObjects: myValidationObjects})
        }
    } else if (this.state.webPage === "scenarioSetup") {
      if (this.ValidateScenarioInputFiles_stream && 
          this.ValidateScenarioInputFiles_text && 
          (this.state.scenarioName.length > 0)) {
        myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="SubmitScenarioButton")].enabled = true;
        if (this.state.scenarioRunStatus === "Completed") {
          myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="ShowResultsButton")].enabled = true;         
        } else {
          myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="ShowResultsButton")].enabled = false;         
        }
        this.setState({validationObjects: myValidationObjects})
      } else {
        myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="SubmitScenarioButton")].enabled = false;
        myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="ShowResultsButton")].enabled = false;         
      }
      this.setState({validationObjects: myValidationObjects})
    }
    this.setState({validationObjects: myValidationObjects}, callback);
  }

// API calling functions

  copyModelToScenarioFolder = (modelPathname, scenarioFolderPathname, copyFolderContents) => {
    API.copyModelToScenarioFolder(modelPathname, 
                                  scenarioFolderPathname, 
                                  copyFolderContents)
    .then(res => this.ExtendSimASPsendFactorDataToServer(0))
    // .then(res => this.ExtendSimASPsendFiles(0))
  };

  ExtendSimASPsendFiles = (fileIndex) => {
    if (this.state.scenarioInputFiles.length) {
      const ExtendSimASPsendFiles = this.ExtendSimASPsendFiles;
      const files = this.state.scenarioInputFiles;
      const scenarioFolderPathname = this.state.scenarioFolderPathname;
      const userLoginSessionID = this.state.userLoginSessionID;
      // const modelPathname = this.state.scenarioFolderPathname + "/" + this.state.ExtendSimModels[1].name;
      const modelPathname = this.state.scenarioFolderPathname + "/" + this.state.currentSelectedExtendSimModel.OriginalPath;
      
      const ExtendSimASPsubmitSimulationScenario = this.ExtendSimASPsubmitSimulationScenario;

      var reader = new FileReader();
      reader.onload = function(event) {
        var filename = files[fileIndex].name;
        event.preventDefault();
        API.sendfile(scenarioFolderPathname,
                      filename,
                      reader.result)
        .then(res => {
            fileIndex++;
            if (fileIndex < files.length) {
              // recursively call until all files have been sent to the server
              ExtendSimASPsendFiles(fileIndex);
            } else {
              ExtendSimASPsubmitSimulationScenario(
                userLoginSessionID,
                modelPathname,
                true);
            }
          })
      };
      reader.readAsBinaryString(files[fileIndex]);
    }
  }

  StreamTextFilesToServer = (fileIndex, copytextfiles) => {
    var reader = new FileReader();
    const { currentSelectedExtendSimModel } = this.state;
    const streamfiles = this.state.scenarioInputFiles_stream;
    const textfiles = this.state.scenarioInputFiles_text;
    const userLoginSessionID = this.state.userLoginSessionID;
    const ExtendSimASPsubmitSimulationScenario = this.ExtendSimASPsubmitSimulationScenario;
    const StreamTextFilesToServer = this.StreamTextFilesToServer;
    const CopyTextFilesToServer = this.CopyTextFilesToServer;
    const modelPathname = this.state.scenarioFolderPathname + "/" + this.state.currentSelectedExtendSimModel.OriginalPath;
    reader.onload = function(event) {
      event.preventDefault();
      var modelDatabasename = currentSelectedExtendSimModel.scenarioInputsTableData[fileIndex].databasename;
      var databaseTablename = currentSelectedExtendSimModel.scenarioInputsTableData[fileIndex].tablename;
      API.senddatastream(modelPathname,
                         modelDatabasename,
                         databaseTablename,
                         reader.result)
      .then(res => {
        fileIndex++;
        if (fileIndex < streamfiles.length) {
          // recursively call until all files have been sent to the server
          StreamTextFilesToServer(fileIndex, true);
        } else {  
          if (copytextfiles && (textfiles.length > 0)) {
            CopyTextFilesToServer(0, true);
          } else {
            ExtendSimASPsubmitSimulationScenario(
              userLoginSessionID,
              modelPathname,
              true);             
          }
        }
      })
    }
    reader.readAsText(streamfiles[fileIndex]);
  }

  CopyTextFilesToServer = (fileIndex, submitsimulationscenario) => {
    var reader = new FileReader();
    const textfiles = this.state.scenarioInputFiles_text;
    const userLoginSessionID = this.state.userLoginSessionID;
    const CopyTextFilesToServer = this.CopyTextFilesToServer;
    const ExtendSimASPsubmitSimulationScenario = this.ExtendSimASPsubmitSimulationScenario;
    const scenarioFolderPathname = this.state.scenarioFolderPathname;
    const modelPathname = scenarioFolderPathname + "/" + this.state.currentSelectedExtendSimModel.OriginalPath;

    reader.onload = function(event) {
      event.preventDefault();
      API.sendfile(scenarioFolderPathname,
                  textfiles[fileIndex].name,
                  reader.result)
      .then(res => {
        fileIndex++;

        if (fileIndex < textfiles.length) {
          // recursively call until all files have been sent to the server
          CopyTextFilesToServer(fileIndex, submitsimulationscenario);
        } else if (submitsimulationscenario) {
          ExtendSimASPsubmitSimulationScenario(
            userLoginSessionID,
            modelPathname,
            true);
          }
      })
    }
    reader.readAsText(textfiles[fileIndex]);
  }

  ExtendSimASPsendFactorDataToServer = (fileIndex) => {   
    // Files to send as streams
    const textfiles = this.state.scenarioInputFiles_text;
    const streamfiles = this.state.scenarioInputFiles_stream;

    if (streamfiles.length > 0) {
      this.StreamTextFilesToServer(0, true);
    } else if (textfiles.length > 0) {
      this.CopyTextFilesToServer(0, true)
    }
  }

  ExtendSimASPsubmitSimulationScenario = (userLoginSessionID, 
                                          modelPathname, 
                                          removeFolderOnCompletion) => {
    //  Submit the scenario to the server
    API.submitSimulationScenario(
      userLoginSessionID, 
      modelPathname, 
      removeFolderOnCompletion)
    .then(res => {
      this.setState({scenarioID: res.data.scenarioID});
      checkModelStatusTimer = setInterval(this.ExtendSimASPCheckModelRunStatus2, 1000);
      // checkModelStatusTimer = setInterval(this.ExtendSimASPCheckModelRunStatus, 1000);
    })
  };

  ExtendSimASPCheckModelRunStatus = () => {
    const { scenarioResultTypes } = this.state;
    const cycletimesindex = scenarioResultTypes.findIndex(obj => obj.type==="Cycle-times");
    const resourcesindex = scenarioResultTypes.findIndex(obj => obj.type==="Resources");
    const poolindex = scenarioResultTypes.findIndex(obj => obj.type==="Pools");

    API.checkmodelrunstatus(
      this.state.scenarioID)
    .then(res => {
      if (res.data.modelRunStatus === runCompletedScenarioStatus) {
        clearInterval(checkModelStatusTimer);
        this.setState({scenarioRunStatus: "Getting results"})
        API.getcycletimeresults(this.state.scenarioFolderPathname + scenarioResultTypes[cycletimesindex].filename, 
                                this.state.userLoginSessionID,
                                this.state.scenarioID,
                                this.state.username)
        .then(res1 => {
          API.getresourceresults(this.state.scenarioFolderPathname + scenarioResultTypes[resourcesindex].filename, 
                                 this.state.userLoginSessionID,
                                 this.state.scenarioID,
                                 this.state.username)
          .then(res2 => {
            API.getpoolresults(this.state.scenarioFolderPathname + scenarioResultTypes[poolindex].filename, 
                               this.state.userLoginSessionID,
                               this.state.scenarioID,
                               this.state.username)
            .then(res3 => {
              var myValidationObjects = this.state.validationObjects;
              myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="ShowResultsButton")].enabled = true;
              this.setState({validationObjects: myValidationObjects});
              this.setState({scenarioRunStatus: "Completed"});
              this.getUserScenarios("getUserScenarios");
            })
          })
        })
      } else if (res.data.modelRunStatus === runInProcessScenarioStatus) {
        this.setState({scenarioRunStatus: "Running"})
      }
    })
  }

  ExtendSimASPCheckModelRunStatus2 = () => {
    const { userLoginSessionID,
            scenarioID,
            username } = this.state;

    API.checkmodelrunstatus(
      this.state.scenarioID)
    .then(res => {
      if (res.data.modelRunStatus === runCompletedScenarioStatus) {
        clearInterval(checkModelStatusTimer);
        var myValidationObjects = this.state.validationObjects;
        myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="ShowResultsButton")].enabled = true;
        this.setState({validationObjects: myValidationObjects});
        API.getUserScenarios(this.state.username)
        .then(res2 => {
          this.setState({userScenarios: res2.data.userScenarios});
          this.setState({scenarioRunStatus: "Completed"});
          API.updateScenarioData(c_completiondate_scenarioUpdateType, 
                                 username, 
                                 scenarioID, 
                                 userLoginSessionID,
                                 false)
          .then(res => {
            API.getUserScenarios(username)
            .then(res2 => 
            {
              this.setState(
              {
                userScenarios: res2.data.userScenarios 
              },
              this.state.history.push('/scenarios-summary'));
            });
          });
        });
      } else if (res.data.modelRunStatus === runInProcessScenarioStatus) {
        this.setState({scenarioRunStatus: "Running"})
      }
    })
  }

// Event handlers

  handleDatabaseDropdownChange = (props, event) => {
    const selectedDatabase = event.target.value;
    this.handleGetDatabaseTables(props, selectedDatabase);
  }

  handleTableDropdownChange = (props, event) => {
    event.preventDefault();
    const selectedTable = event.target.value;
    var { currentSelectedExtendSimModel } = this.state;
    const modelpathname = currentSelectedExtendSimModel.FullPath;
    const databasename = currentSelectedExtendSimModel.scenarioInputsTableData[props.index].databasename;
    const tablename = selectedTable;
    
    currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tablename = selectedTable;
    this.setState(
      { loadingTableData: true },
      () => API.getmodeldatabasetablefields(modelpathname, databasename, tablename, true)
      .then(res => {
        console.log('handleDatabaseTableView - ' + JSON.stringify(res));
        currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tablefields  = res.data.modelDatabaseTableFields.fields;
        currentSelectedExtendSimModel.scenarioInputsTableData[props.index].viewTable = true;
        this.setState(
          { 
            currentSelectedExtendSimModel: currentSelectedExtendSimModel,
            loadingTableData: false
          },
          () => this.renderScenarioInputsSourceTargetTable());
      })
    ) 
  }

  handleDatabaseTableView = (props, event) => {
    event.preventDefault();
    var { currentSelectedExtendSimModel } = this.state;
    const modelpathname = currentSelectedExtendSimModel.FullPath;
    const databasename = currentSelectedExtendSimModel.scenarioInputsTableData[props.index].databasename;
    const tablename = currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tablename;
    API.getmodeldatabasetablefields(modelpathname, databasename, tablename, true)
    .then(res => {
      console.log('handleDatabaseTableView - ' + JSON.stringify(res));
      currentSelectedExtendSimModel.scenarioInputsTableData[props.index].fields = res.data.modelDatabaseTableFields.fields;
      API.getdtabasetablecontentsstream(modelpathname, databasename, tablename)
      .then(res => {
        console.log('handleDatabaseTableView - tableData=' + JSON.stringify(res.data));
        res.data.tableDataArray.forEach(function(row) {
          currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tableRows.push(row);
        })
          currentSelectedExtendSimModel.scenarioInputsTableData[props.index].tableRows.push()
        this.setState({ currentSelectedExtendSimModel: currentSelectedExtendSimModel});
      });
    });
  }
  handleUserInputChange = (key, value, webPage) => {
    this.setState({ [key]: value,
                    webPage: webPage }, this.ValidatePageElements);
    if (webPage === "login") {
      this.setState({ errorLoginPage: "" });
    } else if  (webPage === "signup") {
      this.setState({ errorSignupPage: "" });
    }
  };

  handleDropEvents = (acceptedFiles, callback) => {
    // let currentSelectedExtendSimModel = this.state.currentSelectedExtendSimModel;
    var { currentSourceFileTarget, currentSelectedExtendSimModel } = this.state;
    var i;
    if (currentSourceFileTarget === 'scenariofolder') {
      // : [
        for (i=0;i<acceptedFiles.length;i++) {
          if (i >= currentSelectedExtendSimModel.scenarioInputsSourceFileRows.length) {
            currentSelectedExtendSimModel.scenarioInputsSourceFileRows.push(scenarioInputsSourceFilesRowObject);
          }
        }
  
        const newData = currentSelectedExtendSimModel.scenarioInputsSourceFileRows.map((d, index) => (
          {...d, file: acceptedFiles[index].name}));
        currentSelectedExtendSimModel.scenarioInputsSourceFileRows = newData;
        this.setState({ scenarioInputFiles_text: acceptedFiles,
                        currentSelectedExtendSimModel: currentSelectedExtendSimModel
                      },
                      () => this.ValidatePageElements(callback));  

    } else {
      for (i=0;i<acceptedFiles.length;i++) {
        if (i >= currentSelectedExtendSimModel.scenarioInputsTableData.length) {
          currentSelectedExtendSimModel.scenarioInputsTableData.push(scenarioInputsTableDataRowObject);
        }
      }

      const newData = currentSelectedExtendSimModel.scenarioInputsTableData.map((d, index) => (
        {...d, file: acceptedFiles[index].name}));
      currentSelectedExtendSimModel.scenarioInputsTableData = newData;
      this.setState({ scenarioInputFiles_stream: acceptedFiles,
                      currentSelectedExtendSimModel: currentSelectedExtendSimModel
                    },
                    () => this.ValidatePageElements(callback));
    }
  }

  handleChartTypeChange = (chartType, route, history) => {
    if (chartType === "Wait/Busy Time") {
      this.setState(
        {
          resourceChartDataSeries1: this.state.resourceChartData.TotalBusyTime,
          resourceChartDataSeries2: this.state.resourceChartData.TotalIdleTime
        }
      );
    } else if (chartType === "Utilization") {
      this.setState(
        {
          resourceChartDataSeries1: this.state.resourceChartData.Utilization,
          resourceChartDataSeries2: this.state.resourceChartData.Utilization
        }
      );
    }
    return true;
  }

  handleGetDatabaseTables = (props, selectedDatabase) => {
    var { currentSelectedExtendSimModel } = this.state;
    var tables = [];
    var index = currentSelectedExtendSimModel.scenarioInputsTableData.findIndex(row => row.databasename === selectedDatabase);
    currentSelectedExtendSimModel.scenarioInputsTableData[props.row._index].databasename = selectedDatabase;
    if (index >= 0) {
      currentSelectedExtendSimModel.scenarioInputsTableData[props.row._index].tables = 
        currentSelectedExtendSimModel.scenarioInputsTableData[index].tables;
        this.setState(
          { 
            currentSelectedExtendSimModel: currentSelectedExtendSimModel,
            loadingTableData: false
          },
          () => this.renderScenarioInputsSourceTargetTable()
        );
    } else {
      this.setState({ loadingTableData: true },
        () => API.getmodeldatabasetables(this.state.currentSelectedExtendSimModel.FullPath, selectedDatabase, true)
        .then(res => {
          console.log(JSON.stringify(res.data.modelDatabaseTables));
          res.data.modelDatabaseTables.sort();
          currentSelectedExtendSimModel.databases.tables = [];
          res.data.modelDatabaseTables.forEach(function(tableName) {
            var dbElement = {
              name: tableName,
              fields: [
                {
                  name: "",
                  dataType: ""
                }
              ]
            }
            tables.push(dbElement);
          })
          currentSelectedExtendSimModel.scenarioInputsTableData[props.row._index].tables = tables;
          this.setState(
            { 
              currentSelectedExtendSimModel: currentSelectedExtendSimModel,
              loadingTableData: false 
            },
            () => this.renderScenarioInputsSourceTargetTable()
          )
        })
      )
    }
  }

  handleSourceFileTargetChange = (selectedTarget) => {
    var { currentSourceFileTarget, currentSelectedExtendSimModel } = this.state;
    if (currentSourceFileTarget === 'scenariofolder') {
      currentSourceFileTarget = 'databasetables';
    } else {
      currentSourceFileTarget = 'scenariofolder';
    }
    this.setState({ currentSourceFileTarget: currentSourceFileTarget });
  }

  handleGetModelDatabases = (selectedModel, callback, history) => {
    var currentSelectedExtendSimModel = this.state.currentSelectedExtendSimModel;

    var selectedModelObject = this.setUserSelectedExtendSimModel(selectedModel);
    currentSelectedExtendSimModel.OriginalPath = selectedModelObject.OriginalPath;
    currentSelectedExtendSimModel.FullPath = selectedModelObject.FullPath;
    this.setState(
      { 
        loadingTableData: true 
      },
      () => API.getmodeldatabases(currentSelectedExtendSimModel.FullPath, true)
      .then(res => 
        {
          currentSelectedExtendSimModel.databases = [];
          res.data.modelDatabases.sort();
          res.data.modelDatabases.forEach(function(element) {
            var dbElement = {
              name: element,
              tables: [
                {
                  name: "",
                  fields: [
                    {
                      name: "",
                      dataType: ""
                    }
                  ]
                }
              ]
            }
            currentSelectedExtendSimModel.databases.push(dbElement);
          })

          currentSelectedExtendSimModel.currentDatabase = res.data.modelDatabases[0];
          this.setState(
            { 
              currentSelectedExtendSimModel: currentSelectedExtendSimModel,
              loadingTableData: false 
            }, 
            () => callback()
          );
        }
      )
    );
  }

  handleLoginSubmit = (event, history) => {
    var myValidationObjects = this.state.validationObjects;
    var userScenarios = [];

    event.preventDefault();
    API.login(this.state)
    .then(res => {
      API.getserverextendmodelsrootdirectory(this.state)
        .then(res1 => {
          console.log(JSON.stringify(res1.data.userDirectoryFiles));
          this.setState({ userExtendSimServerModels: res1.data.userDirectoryFiles.filter(file => file.OriginalPath.indexOf(".mox")>0) });
          this.setState({ currentUser: res.data});
          this.setState({ userLoginSessionID: res.data.userLoginSessionID});
          // Enable scenario navbar link
          myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="Scenario-navbar-option")].enabled = true;
          this.setState({validationObjects: myValidationObjects});
          API.getUserScenarios(this.state.username)
            .then(res2 => {
              if (res2.data.userScenarios === undefined) {
              } else {
                userScenarios = res2.data.userScenarios;
                // this.handleSubmitSimulationScenario
              }
              this.setState({userScenarios: userScenarios,
                            webPage: "scenarioSetup"},
                  () => history.push('/'));
                  // () => history.push('/scenario-setup'));
              })
            .catch(function(error) {
              /* potentially some code for generating an error specific message here */
              this.setState({userScenarios: userScenarios});
              history.push('/scenario-setup');
            });
        });
    })
    .catch(err => {
        console.log(JSON.stringify(err.response.data.msg));
        this.setState({ errorLoginPage: err.response.data.msg }, this.resetLoginPage);
      });
    };

  handleSignupSubmit = (event, history) => {
    event.preventDefault();
    API.signup(this.state)
    .then(res => {
      this.handleLoginSubmit(event, history);
        // history.push('/login');
    })
    .catch(err => {
        console.log(err.response.data);
        this.setState({ errorSignupPage: err.response.data.msg }, this.resetSignupPage);
    })
  }

  handleModelSelection = (selectedExtendSimModel) => {

    var selectedModel = this.setUserSelectedExtendSimModel(selectedExtendSimModel);
    this.setState({ currentSelectedExtendSimModel: selectedModel} );
  }
  
  handleSubmitSimulationScenario = (event, history) => {
    event.preventDefault();
    this.ValidatePageElements();
    const {validationObjects} = this.state;
    validationObjects[validationObjects.findIndex(obj => obj.name==="SubmitScenarioButton")].enabled = false;
    this.setState({validationObjects : validationObjects,
                   history: history }, () => {
      API.createScenario(this.state)
      .then(res_createScenario => {
        API.createScenarioFolder(this.state.userLoginSessionID, this.state.scenarioName, this.state.scenarioName)
        .then(res => {
          this.setState({scenarioRunStatus: "Submitted"});
          this.setState({scenarioFolderPathname: res.data.scenarioFolderPathname});
          // const modelfilepath = this.state.modelpath + "/" + this.state.currentSelectedExtendSimModel.OriginalPath;
          const modelfilepath = this.state.currentSelectedExtendSimModel.FullPath;
          // const modelfilepath = this.state.modelpath + "/" + this.state.ExtendSimModels[1].name;       
          this.copyModelToScenarioFolder(modelfilepath, 
                                        res.data.scenarioFolderPathname, 
                                        true); 
        })
      });
    });
  };

  handleShowResults = (event, history) => {
    event.preventDefault();
    // Disable Show Results button on Scenario Setup page
    var myValidationObjects = this.state.validationObjects;
    myValidationObjects[myValidationObjects.findIndex(obj => obj.name==="ShowResultsButton")].enabled = false;
    this.setState({validationObjects: myValidationObjects});
      API.getUserScenarios(this.state.username)
      .then(res2 => {
        this.setState({userScenarios: res2.data.userScenarios});
        console.log('scenario results=' + JSON.stringify(res2));
        history.push('/scenario-results');
      });
  };

  handleTableSelectionDeleteScenario = (event, scenarioID, history) => {
    event.preventDefault();
    var userScenarios = [];
    API.deleteScenario(this.state.username, scenarioID)
    .then(res => {
      API.getUserScenarios(this.state.username)
      .then(res2 => {
        if (res2.data.userScenarios === undefined) {
        } else {
          userScenarios = res2.data.userScenarios;
        }
        this.setState({userScenarios: userScenarios});
        history.push('/scenarios-summary');
      })
      .catch(function(error) {
        history.push('/scenarios-summary');      
      })
    })
    .catch(function(error) {
      alert('Catch error: Post scenario delete');
    });
  }
  handleShowTableRowResults = (event,
                               scenarioID, 
                               history
                              ) => {
    event.preventDefault();
    // We need to lookup the scenario folder pathname using the scenario ID
    const selectedScenario = this.getMatchingScenario(scenarioID);
    const scenarioFolderPathname = selectedScenario.scenarioFolderPathname;
    const scenarioName = selectedScenario.scenarioName;
    const {username, userLoginSessionID, cycleTimeResultsFilename} = this.state;
    const currentScenarioID = scenarioID
    console.log("scenarioFolderPathname=" + scenarioFolderPathname + 
          " cycleTimeResultsFilename=" + cycleTimeResultsFilename + 
          " userLoginSessionID=" +userLoginSessionID);
    API.getScenarioCycletimeData (scenarioID, username) 
    .then(res1 => {
      console.log('scenario cycleTimeData=' + res1.data.cycleTimeData);
      // var parsedArray = res1.data.cycleTimeData.split('\r\n').map(function(ln){
      //   return ln.split('\t');
      // });
      // console.log('parsedArray=' + parsedArray);
      this.setState({cycleTimeData: res1.data.cycleTimeData});  
      this.setState({scenarioID: currentScenarioID});
      this.setState({scenarioName: scenarioName});
      history.push('/cycle-time-results');
    });
  }

  handleTableSelectionShowScenarioResults = (event,
                                             rowIndex, 
                                             history) => {
    event.preventDefault();
    // We need to lookup the scenario folder pathname using the scenario ID
    // const selectedScenario = this.getMatchingScenario(scenarioID);
    const selectedScenario = this.state.userScenarios[rowIndex];

    this.setState(
                  { 
                    scenarioFolderPathname: selectedScenario.scenarioFolderPathname,
                    scenarioName: selectedScenario.scenarioName,
                    scenarioID: selectedScenario.scenarioID,
                    currentScenarioRowIndex: rowIndex 
                  }, () => 
                  {
                    if (!selectedScenario.resultsArchived) {
                      API.getscenarioresultsstream('getcycletimeresultsstream',
                          selectedScenario.scenarioModelPathname,
                          AdvancedResources_dBname,
                          CycleTimeResults_tableName, 
                          selectedScenario.userLoginSessionID,
                          selectedScenario.scenarioID,
                          selectedScenario.username)
                      .then(res => 
                      {
                        API.getscenarioresultsstream('getresourceresultsstream',
                          selectedScenario.scenarioModelPathname,
                          AdvancedResources_dBname,
                          Resources_tableName, 
                          selectedScenario.userLoginSessionID,
                          selectedScenario.scenarioID,
                          selectedScenario.username)
                        .then(res1 => 
                        {
                          API.getscenarioresultsstream('getpoolresultsstream',
                            selectedScenario.scenarioModelPathname,
                            AdvancedResources_dBname,
                            Pools_tableName, 
                            selectedScenario.userLoginSessionID,
                            selectedScenario.scenarioID,
                            selectedScenario.username)
                          .then(res2 => 
                          {
                            API.updateScenarioData(c_resultsArchived_scenarioUpdateType, 
                              selectedScenario.username, 
                              selectedScenario.scenarioID, 
                              selectedScenario.userLoginSessionID,
                              true)
                            .then(res3 =>
                            {
                              API.getUserScenarios(selectedScenario.username)
                              .then(res4 => 
                              {
                                this.setState(
                                  {
                                    userScenarios: res4.data.userScenarios 
                                  },
                                  history.push('/scenario-results')
                                );
                              });
                            });
                          });
                        });
                      });
                    } else {
                      API.getUserScenarios(selectedScenario.username)
                      .then(res4 => 
                      {
                        this.setState(
                          {
                            userScenarios: res4.data.userScenarios 
                          },
                          history.push('/scenario-results')
                        );
                      });
                    }
                  });
  }
  handleShowScenarioResults = (event,
                               resultType,
                               history) => {
    event.preventDefault();
    // We need to lookup the scenario folder pathname using the scenario ID
    const { userScenarios, currentScenarioRowIndex } = this.state;
    const username = userScenarios[currentScenarioRowIndex].username;
    const scenarioID = userScenarios[currentScenarioRowIndex].scenarioID;
    if (resultType === "Cycle-times") {
      // API.getscenarioresultsstream('getcycletimeresultsstream',
      //                              scenarioModelPathname,
      //                              AdvancedResources_dBname,
      //                              CycleTimeResults_tableName, 
      //                              userLoginSessionID,
      //                              scenarioID,
      //                              username)
      // .then(res => {
        API.getScenarioCycletimeData (scenarioID, username) 
        .then(res1 => {
          console.log('scenario cycleTimeData=' + res1.data.cycleTimeData);
          this.setState({cycleTimeData: res1.data.cycleTimeData});
          // var data = this.makeCycleTimeChartData(res1.data.cycleTimeData, 'totalJobsProcessed');
    
          this.setState({cycleTimeChartData: 
            {
              totalJobsProcessed: this.makeCycleTimeChartData(res1.data.cycleTimeData, 'totalJobsProcessed'),
              totalProcessTime: this.makeCycleTimeChartData(res1.data.cycleTimeData, 'totalProcessTime'),
              totalWaitTime: this.makeCycleTimeChartData(res1.data.cycleTimeData, 'totalWaitTime'),
              avgProcessTime: this.makeCycleTimeChartData(res1.data.cycleTimeData, 'avgProcessTime'),
              avgWaitTime: this.makeCycleTimeChartData(res1.data.cycleTimeData, 'avgWaitTime'),
              avgCycleTime: this.makeCycleTimeChartData(res1.data.cycleTimeData, 'avgCycleTime'),
              CoVarrivals: this.makeCycleTimeChartData(res1.data.cycleTimeData, 'CoVarrivals'),
              CoVdepartures: this.makeCycleTimeChartData(res1.data.cycleTimeData, 'CoVdepartures')
            }
          });  
          history.push('/cycle-time-results');
        // });
      });
    } else if (resultType === "Resources") {
      // API.getscenarioresultsstream('getresourceresultsstream',
      //                              scenarioModelPathname,
      //                              AdvancedResources_dBname,
      //                              Resources_tableName, 
      //                              userLoginSessionID,
      //                              scenarioID,
      //                              username)
      // .then(res => {
        API.getResourceData (scenarioID, username) 
        .then(res1 => {
          console.log('scenario resourceData=' + res1.data.resourceData);
          this.setState({resourceData: res1.data.resourceData});
          this.setState(
            {
              resourceChartData: 
                {
                  TotalOrdersServiced: this.makeResourceChartData(res1.data.resourceData, 'TotalOrdersServiced'),
                  TotalIdleTime: this.makeResourceChartData(res1.data.resourceData, 'TotalIdleTime'),
                  TotalBusyTime: this.makeResourceChartData(res1.data.resourceData, 'TotalBusyTime'),
                  TotalBusyOffShiftTime: this.makeResourceChartData(res1.data.resourceData, 'TotalBusyOffShiftTime'),
                  TotalReservedTime: this.makeResourceChartData(res1.data.resourceData, 'TotalReservedTime'),
                  TotalDownTime: this.makeResourceChartData(res1.data.resourceData, 'TotalDownTime'),
                  TotalOffShiftTime: this.makeResourceChartData(res1.data.resourceData, 'TotalOffShiftTime'),
                  TotalDisabledTime: this.makeResourceChartData(res1.data.resourceData, 'TotalDisabledTime'),
                  TotalAllocatedTime: this.makeResourceChartData(res1.data.resourceData, 'TotalAllocatedTime'),
                  TotalCost: this.makeResourceChartData(res1.data.resourceData, 'TotalCost'),
                  TotalFailedTime: this.makeResourceChartData(res1.data.resourceData, 'TotalFailedTime'),
                  TotalQuantityAllocated: this.makeResourceChartData(res1.data.resourceData, 'TotalQuantityAllocated'),
                  TotalQuantityAllocationTime: this.makeResourceChartData(res1.data.resourceData, 'TotalQuantityAllocationTime'),
                  TotalReassignedTime: this.makeResourceChartData(res1.data.resourceData, 'TotalReassignedTime'),
                  TotalScheduledDownTime: this.makeResourceChartData(res1.data.resourceData, 'TotalScheduledDownTime'),
                  TotalUnscheduledDownTime: this.makeResourceChartData(res1.data.resourceData, 'TotalUnscheduledDownTime'),
                  QuantityUtilization: this.makeResourceChartData(res1.data.resourceData, 'QuantityUtilization'),
                  Utilization: this.makeResourceChartData(res1.data.resourceData, 'Utilization')
                }
              },
              () => this.setState(
                {
                  resourceChartDataSeries1: this.state.resourceChartData.TotalBusyTime,
                  resourceChartDataSeries2: this.state.resourceChartData.TotalIdleTime
                },
                () => {
                  history.push('/resource-results')
                }
              )
            );
        // });
      });
    } else if (resultType === "Pools") {
      // API.getscenarioresultsstream('getpoolresultsstream',
      //                              scenarioModelPathname,
      //                              AdvancedResources_dBname,
      //                              Pools_tableName, 
      //                              userLoginSessionID,
      //                              scenarioID,
      //                              username)
      // .then(res => {
        API.getPoolData (scenarioID, username) 
        .then(res1 => {
          console.log('scenario resourceData=' + res1.data.poolData);
          this.setState({poolData: res1.data.poolData});
          this.setState({poolChartData: 
            {
              TotalOrdersServiced: this.makePoolChartData(res1.data.poolData, 'TotalOrdersServiced'),
              TotalIdleTime: this.makePoolChartData(res1.data.poolData, 'TotalIdleTime'),
              TotalBusyTime: this.makePoolChartData(res1.data.poolData, 'TotalBusyTime'),
              TotalBusyOffShiftTime: this.makePoolChartData(res1.data.poolData, 'TotalBusyOffShiftTime'),
              TotalReservedTime: this.makePoolChartData(res1.data.poolData, 'TotalReservedTime'),
              TotalDownTime: this.makePoolChartData(res1.data.poolData, 'TotalDownTime'),
              TotalOffShiftTime: this.makePoolChartData(res1.data.poolData, 'TotalOffShiftTime'),
              TotalDisabledTime: this.makePoolChartData(res1.data.poolData, 'TotalDisabledTime'),
              TotalAllocatedTime: this.makePoolChartData(res1.data.poolData, 'TotalAllocatedTime'),
              TotalCost: this.makePoolChartData(res1.data.poolData, 'TotalCost'),
              TotalFailedTime: this.makePoolChartData(res1.data.poolData, 'TotalFailedTime'),
              TotalQuantityAllocated: this.makePoolChartData(res1.data.poolData, 'TotalQuantityAllocated'),
              TotalQuantityAllocationTime: this.makePoolChartData(res1.data.poolData, 'TotalQuantityAllocationTime'),
              TotalReassignedTime: this.makePoolChartData(res1.data.poolData, 'TotalReassignedTime'),
              TotalScheduledDownTime: this.makePoolChartData(res1.data.poolData, 'TotalScheduledDownTime'),
              TotalUnscheduledDownTime: this.makePoolChartData(res1.data.poolData, 'TotalUnscheduledDownTime'),
              QuantityUtilization: this.makePoolChartData(res1.data.poolData, 'QuantityUtilization'),
              Utilization: this.makePoolChartData(res1.data.poolData, 'Utilization')
            }});
          history.push('/pool-results');
        // });
      });
    } 
  }
  renderModalTable = () => {
    const { currentSelectedExtendSimModel } = this.state;
    var rows = currentSelectedExtendSimModel.scenarioInputsTableData;
    var columns = currentSelectedExtendSimModel.scenarioInputsTableColumns;

    for (var i=0;i<columns.length;i++) {
      columns[i].width = this.setColumnWidth(rows, columns[i].Header, columns[i].accessor, columns[i].id, columns[i].style["font"], columns[i].style["fontSize"]);
    }
    return <ReactTable
      data={rows}
      // columns={currentSelectedExtendSimModel.scenarioInputsTableColumns}
      columns={columns}
      defaultPageSize={4}
      pageSize = {currentSelectedExtendSimModel.scenarioInputsTableData.length}
      pageSizeOptions = {[4, 8]}
      className="-striped -highlight"
      getTableProps={() => {
        return {
        };
      }}
    />
  }
  renderDialogVariableFactorsTable = () => {
    const { currentSelectedExtendSimModel } = this.state;
    var rows = currentSelectedExtendSimModel.dialogVariableFactorsRows;
    var columns = currentSelectedExtendSimModel.dialogVariableFactorsColumns;
    for (var i=0;i<columns.length;i++) {
      columns[i].width = this.setCellColumnWidth(columns[i].Header, columns[i].Header, columns[i].style["fontSize"]);
    }
    return <ReactTable
      data={rows}
      columns={columns}
      defaultPageSize={4}
      pageSize = {rows.length}
      pageSizeOptions = {[4, 8]}
      className="-striped -highlight"
      getTableProps={() => {
        return {
          onScroll: e => {
            // if (this.tableScrollTop === e.target.scrollTop) {
            //   let left = e.target.scrollLeft > 0 ? e.target.scrollLeft : 0;
            // } else {
            //   this.tableScrollTop = e.target.scrollTop;
            // }
          }
        };
      }}
    />
  }

  renderScenarioInputsSourceTargetTable = () => {
    const { currentSelectedExtendSimModel } = this.state;
    var rows = currentSelectedExtendSimModel.scenarioInputsTableData;
    var columns = currentSelectedExtendSimModel.scenarioInputsTableColumns;
  
    for (var i=0;i<columns.length;i++) {
      columns[i].width = this.setColumnWidth(rows, columns[i].Header, columns[i].accessor, columns[i].id, columns[i].style["font"], columns[i].style["fontSize"]);  
    }
      return <ReactTable
        data={rows}
        columns={columns}
        defaultPageSize={4}
        pageSize = {currentSelectedExtendSimModel.scenarioInputsTableData.length}
        pageSizeOptions = {[4, 8]}
        className="-striped -highlight"
      />
  }

  renderScenarioInputsSourceFiles = () => {
    const { currentSelectedExtendSimModel } = this.state;
    var rows = currentSelectedExtendSimModel.scenarioInputsSourceFileRows;
    var columns = currentSelectedExtendSimModel.scenarioInputsSourceFileColumns;
  
    for (var i=0;i<columns.length;i++) {
      columns[i].width = this.setColumnWidth(rows, columns[i].Header, columns[i].accessor, columns[i].id, columns[i].style["font"], columns[i].style["fontSize"]);
    }
    return <ReactTable
        data={rows}
        columns={columns}
        defaultPageSize={4}
        pageSize = {currentSelectedExtendSimModel.scenarioInputsSourceFileRows.length}
        pageSizeOptions = {[4, 8]}
        className="-striped -highlight"
      />
  }

  renderCycleTimeTableData = () => {
    // event.preventDefault();
    return this.state.cycleTimeData.map((rowData, key) => {
      const {
              stepname, 
              resourceRequirement, 
              totalJobsProcessed, 
              totalProcessTime, 
              totalWaitTime,
              avgProcessTime,
              avgWaitTime,
              avgCycleTime,
              CoVarrivals,
              CoVdepartures
            } = rowData; //destructuring
       return (
        <tr key={key}>             
          <td className="table-data-strings">{stepname}</td>
          <td className="table-data-strings">{resourceRequirement}</td>
          <td className="table-data-numbers">{totalJobsProcessed}</td>
          <td className="table-data-numbers">{totalProcessTime.toFixed(2)}</td>
          <td className="table-data-numbers">{totalWaitTime.toFixed(2)}</td>
          <td className="table-data-numbers">{avgProcessTime.toFixed(2)}</td>
          <td className="table-data-numbers">{avgWaitTime.toFixed(2)}</td>
          <td className="table-data-numbers">{avgCycleTime.toFixed(2)}</td>
          <td className="table-data-numbers">{CoVarrivals.toFixed(2)}</td>
          <td className="table-data-numbers">{CoVdepartures.toFixed(2)}</td>
        </tr> 
       )
    })  
  }

  renderResourcesTableData = () => {
    // event.preventDefault();
    return this.state.resourceData.map((rowData, key) => {
      const {
        ResourceID,
        Pool,
        TotalOrdersServiced,
        TotalIdleTime,
        TotalBusyTime,
        TotalBusyOffShiftTime,
        TotalDownTime,
        TotalOffShiftTime,
        TotalFailedTime,
        TotalScheduledDownTime,
        TotalUnscheduledDownTime,
        TotalQuantityAllocationTime,
        QuantityUtilization,
        Utilization
          } = rowData; //destructuring
       return (
        <tr key={key}>  
          <td className="table-data-strings">{ResourceID}</td>
          <td className="table-data-strings">{Pool}</td>
          <td className="table-data-numbers">{TotalOrdersServiced}</td>
          <td className="table-data-numbers">{TotalIdleTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalBusyTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalBusyOffShiftTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalDownTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalOffShiftTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalFailedTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalScheduledDownTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalUnscheduledDownTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalQuantityAllocationTime.toFixed(2)}</td>
          <td className="table-data-numbers">{QuantityUtilization.toFixed(2)}</td>
          <td className="table-data-numbers">{Utilization.toFixed(2)}</td>
        </tr> 
       )
    })  
  }

  renderPoolsTableData = () => {
    // event.preventDefault();
    return this.state.poolData.map((rowData, key) => {
      const {
        Name,
        TotalOrdersServiced,
        TotalIdleTime,
        TotalBusyTime,
        TotalBusyOffShiftTime,
        TotalDownTime,
        TotalOffShiftTime,
        TotalFailedTime,
        TotalScheduledDownTime,
        TotalUnscheduledDownTime,
        TotalQuantityAllocationTime,
        QuantityUtilization,
        Utilization
          } = rowData; //destructuring
       return (
        <tr key={key}>  
          <td className="table-data-strings">{Name}</td>
          <td className="table-data-numbers">{TotalOrdersServiced}</td>
          <td className="table-data-numbers">{TotalIdleTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalBusyTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalBusyOffShiftTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalDownTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalOffShiftTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalFailedTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalScheduledDownTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalUnscheduledDownTime.toFixed(2)}</td>
          <td className="table-data-numbers">{TotalQuantityAllocationTime.toFixed(2)}</td>
          <td className="table-data-numbers">{QuantityUtilization.toFixed(2)}</td>
          <td className="table-data-numbers">{Utilization.toFixed(2)}</td>
        </tr> 
       )
    })  
  }

  renderUserScenariosTableData = (handleTableRowResults, handleDeleteSelectedScenario) => {
    return this.state.userScenarios.map((scenario, index) => {
      const { username, 
              scenarioID, 
              scenarioName,
              scenarioSubmissionDateTime,
              scenarioCompletionDateTime} = scenario; //destructuring
       return (
          <tr key={index}>
             <td>{scenarioID}</td>
             <td>{scenarioName}</td>
             <td>{username}</td>
             <td>{scenarioSubmissionDateTime}</td>
             <td>{scenarioCompletionDateTime}</td>
             <td>
              {/* <button id={scenarioID} onClick={(event) => handleTableRowResults(event)}> */}
              <button row={index} onClick={(event) => handleTableRowResults(event)}>
               Show
               </button></td>
             <td>
             <button row={index} onClick={(event) => handleDeleteSelectedScenario(event)}>
                 Delete
                </button></td>
          </tr>
       )
    })
 }

 renderUserScenarioResultsTableData = (handleShowScenarioResults) => {
  return this.state.scenarioResultTypes.map((resultType, key) => {
    const { type } = resultType; //destructuring
     return (
        <tr key={key}>
           <td>{type}</td>
           <td>
             <button id={type} onClick={(event) => handleShowScenarioResults(event)}>
             Show
             </button>
          </td>
        </tr>
     )
  })
}

  render() {
    return (
      <Context.Provider value={{
        user: this.state.currentUser,
        username: this.state.username,
        password: this.state.password,
        reenteredpassword: this.state.reenteredpassword,
        activationkey: this.state.activationkey,
        userLoginSessionID: this.state.userLoginSessionID,
        scenarioID: this.state.scenarioID,
        scenarioName: this.state.scenarioName,
        scenarioFolderPathname: this.state.scenarioFolderPathname,
        validationObjects: this.state.validationObjects,
        scenarioRunStatus: this.state.scenarioRunStatus,
        cycleTimeData: this.state.cycleTimeData,
        cycleTimeChartData: this.state.cycleTimeChartData,
        resourceChartData: this.state.resourceChartData,
        poolChartData: this.state.poolChartData,
        userScenarios: this.state.userScenarios,
        errorLoginPage: this.state.errorLoginPage,
        errorSignupPage: this.state.errorSignupPage,
        chartProperties: this.state.chartProperties,
        resourceChartDataSeries1: this.state.resourceChartDataSeries1,
        resourceChartDataSeries2: this.state.resourceChartDataSeries2,
        pathname: this.state.pathname,
        showModalTable: this.state.showModalTable,
        userExtendSimServerModels: this.state.userExtendSimServerModels,
        currentSelectedExtendSimModel: this.state.currentSelectedExtendSimModel,
        loadingTableData: this.state.loadingTableData,
        showDatabaseTargetsTable: this.state.showDatabaseTargetsTable,
        showDialogVariableFactorsTable: this.state.showDialogVariableFactorsTable,
        showModalDialogFactorsFilters: this.state.showModalDialogFactorsFilters,
        currentSourceFileTarget: this.state.currentSourceFileTarget,
        handleUserInputChange: this.handleUserInputChange,
        handleDropEvents: this.handleDropEvents,
        handleChartTypeChange: this.handleChartTypeChange,
        handleSignupSubmit: this.handleSignupSubmit,
        handleLoginSubmit: this.handleLoginSubmit,
        handleModelSelection: this.handleModelSelection,
        handleSubmitSimulationScenario: this.handleSubmitSimulationScenario,
        handleShowScenarioResults: this.handleShowScenarioResults,
        handleShowResults: this.handleShowResults,
        handleShowTableRowResults: this.handleShowTableRowResults,
        handleTableSelectionShowScenarioResults: this.handleTableSelectionShowScenarioResults,
        handleTableSelectionDeleteScenario: this.handleTableSelectionDeleteScenario,
        handleGetModelDatabases: this.handleGetModelDatabases,
        handleGetDatabaseTables: this.handleGetDatabaseTables,
        handleDatabaseDropdownChange: this.handleDatabaseDropdownChange,
        ValidatePageElements: this.ValidatePageElements,
        renderUserScenariosTableData: this.renderUserScenariosTableData,
        renderCycleTimeTableData: this.renderCycleTimeTableData,
        renderResourcesTableData: this.renderResourcesTableData,
        renderPoolsTableData: this.renderPoolsTableData,
        renderUserScenarioResultsTableData: this.renderUserScenarioResultsTableData,
        renderScenarioInputsSourceTargetTable: this.renderScenarioInputsSourceTargetTable,
        renderScenarioInputsSourceFiles: this.renderScenarioInputsSourceFiles,
        renderDialogVariableFactorsTable: this.renderDialogVariableFactorsTable,
        renderModalTable: this.renderModalTable,
        setCellColumnWidth: this.setCellColumnWidth,
        setColumnWidth: this.setColumnWidth,
        handleSourceFileTargetChange: this.handleSourceFileTargetChange,
        toggleModal: this.toggleModal,
        toggleDialogVariableFactorsTable: this.toggleDialogVariableFactorsTable,
        toggleDatabaseTargetsTable: this.toggleDatabaseTargetsTable,
        toggleSetDialogParameterValuesTable: this.toggleSetDialogParameterValuesTable,
        toggleDialogFactorFiltersModal: this.toggleDialogFactorFiltersModal
      }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Context;
