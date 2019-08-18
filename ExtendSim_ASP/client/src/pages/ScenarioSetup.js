import React from 'react';
import { Redirect } from "react-router-dom";
import "react-table/react-table.css";
import BasicDropArea from '../components/BasicDropArea';
import ShowModalTable from '../components/ShowModalTable';
import ShowModalSetDialogFactorFilters from '../components/ShowModalSetDialogFactorFilters';
import UserContext from '../utils/UserContext'; 
import LoadingOverlay from 'react-loading-overlay';

class ScenarioSetup extends React.Component {
  static contextType = UserContext;

  state = {
    loading: false,
    scenarioSubmitted: false,
    getdatabasesbuttondisabled: false,
    selectedModel: {
      OriginalPath: "",
      FullPath: ""
    },
    modelDatabases: [],
    selectedDatabases: [],
    data: [],
    columns: []
  };

  componentDidMount() {
    const { currentSelectedExtendSimModel} = this.context;
    this.setState({ modelDatabases: currentSelectedExtendSimModel.databases,
      selectedModel: 
      {
        FullPath: currentSelectedExtendSimModel.FullPath
      },
      data: currentSelectedExtendSimModel.scenarioInputsTableData,
      columns: currentSelectedExtendSimModel.scenarioInputsTableColumns,
      loading: false });
  }

  onFiltersChange = (row, event) => {
    var { scenarioInputsTableData } = this.content;

    scenarioInputsTableData[row.index].databasename = event.target.value;
    this.content.setState({ scenarioInputsTableData: scenarioInputsTableData });
  }

  updateScenarioState = () => {
    const { currentSelectedExtendSimModel} = this.context;
    // var result = currentSelectedExtendSimModel.databases.map((myDatabase, index) => {
    currentSelectedExtendSimModel.databases.map((myDatabase, index) => {
        return (<option key={myDatabase.name} value={myDatabase.name}>{myDatabase.name}</option>)
      // return (<option key={myDatabase.name} value={myDatabase.name} selected={(myDatabase.name===currentSelectedExtendSimModel.scenarioInputsTableData[index].database? 'selected' : '')}>{myDatabase.name}</option>)
    });
    this.setState({ modelDatabases: currentSelectedExtendSimModel.databases,
                    selectedModel: 
                    {
                      FullPath: currentSelectedExtendSimModel.FullPath
                    },
                    data: currentSelectedExtendSimModel.scenarioInputsTableData,
                    columns: currentSelectedExtendSimModel.scenarioInputsTableColumns,
                    loading: false });
  }
  handleToggleEvent = (event, toggleEventFunction) => {
    toggleEventFunction(event);
  }
  handleOnFiltersChange = (props, event) => {
  }
  handleBeforeUnload = (event) => {
    event.preventDefault();
  }

  handleChange = (event, key, onChangeFunction, validationObjects) => {
    const { value } = event.target;
    onChangeFunction(key, value, "scenarioSetup");
  }

  handleFileTargetDropdownChange = (event, handleSourceFileTargetChange) => {
    event.preventDefault();
    handleSourceFileTargetChange(event.target.value);
  }
  handleModelDropdownChange = (event, handleGetModelDatabases) => {
    const { history } = this.props;
    const FullPath = event.target.value;
    event.preventDefault();
    var pos = FullPath.lastIndexOf("\\");
    var OriginalPath = FullPath.substr(pos+1, FullPath.length-1);
    this.setState({ loading: true,
                    getdatabasesbuttondisabled: true,
                    selectedModel:
                    {
                      OriginalPath: OriginalPath,
                      FullPath: FullPath
                    }
                  },
                  () => handleGetModelDatabases(FullPath, this.updateScenarioState, history));
  }
  handleScenarioSubmissionClick = (event, onSubmitScenarioClickFunction) => {
    const { history } = this.props;
    this.setState({ scenarioSubmitted: true });
    onSubmitScenarioClickFunction(event, history);
  }

  handleShowResultsClick = (event, onShowResultsClickFunction) => {
    const { history } = this.props;
    onShowResultsClickFunction(event, history);
  }
  handleSetFiltersButtonClick = (event, toggleModalFunction) => {
    event.preventDefault();
    toggleModalFunction(event);
  }
  render() {
    // const { username, password, error } = this.state;
    const { user, currentSelectedExtendSimModel} = this.context;
    this.setState.modelDatabases = currentSelectedExtendSimModel.databases;
    if (this.state.modelDatabases === undefined) {
      this.setState.modelDatabases = [];
    }
    return (
      user 
      ? (
      <UserContext.Consumer>
        {({handleUserInputChange,
           handleDropEvents,
           handleSubmitSimulationScenario,
           handleShowResults,
           handleGetModelDatabases,
           handleGetDatabaseTables,
           userLoginSessionID, 
           scenarioName,
           scenarioID,
           scenarioRunStatus,
           userExtendSimServerModels,
           renderDialogVariableFactorsTable,
           renderScenarioInputsSourceFiles,
           renderScenarioInputsSourceTargetTable,
           validationObjects,
           loadingTableData,
           showDialogVariableFactorsTable,
           showDatabaseTargetsTable,
           currentSourceFileTarget,
           handleSourceFileTargetChange,
           toggleDialogVariableFactorsTable,
           toggleDatabaseTargetsTable,
           toggleDialogFactorFiltersModal,
          }) => (
          <div id="home">
            <div className="container my-scenario-container">
              <div className="row">
                <header id="ExtendSim-header">
                </header>
              </div>
              <div className="row">
                <div className="col-8">
                  <h2>ExtendSim ASP Scenario Setup</h2>
                  <form id="scenario-inputs-form" action="POST">
                    <LoadingOverlay
                          active={loadingTableData}
                          spinner
                          text='Retrieving information from server...'>
                      <div>
                        <label 
                          htmlFor="scenario-name-input"
                          className="scenario-input-labels">
                            Scenario name:
                        </label>
                        <input 
                          value={scenarioName}
                          onChange={(e) => this.handleChange(e, 'scenarioName', handleUserInputChange, validationObjects)}
                          type="text" 
                          id="scenario-name-input"
                          // className="form-control" 
                          aria-describedby="scenario-name-input" 
                          placeholder="Enter scenario name">
                        </input>
                      </div>
                      <div>
                        <label 
                          htmlFor="scenario-model-dropdown" 
                          className="scenario-input-labels">
                            Scenario server model:
                        </label>
                        <select 
                          value={this.state.selectedModel.FullPath}
                          onChange={(event) => this.handleModelDropdownChange(event, handleGetModelDatabases)}
                          id="scenario-model-dropdown">
                          <option value="">Select a model...</option>
                          {userExtendSimServerModels.map((model, index) => (
                              <option key={index} value={model.FullPath}>
                              {model.OriginalPath}
                              </option>
                          ))}
                      </select>
                      </div>
                      <div id="setup-dialog-parameter-values">
                      {!showDialogVariableFactorsTable ? <div> 
                        <button 
                          disabled={currentSelectedExtendSimModel.OriginalPath===""}
                          className='dialog-factors-button'
                          onClick={(event) => toggleDialogVariableFactorsTable(event) }>Set dialog factor values</button>
                        </div> :
                        <div>
                          <button
                            className='dialog-factors-button' 
                            onClick={(event) => toggleDialogVariableFactorsTable(event)}>Hide
                          </button>
                          <button
                              className='dialog-factors-button'
                              onClick={(event) => this.handleSetFiltersButtonClick(event, toggleDialogFactorFiltersModal)}
                              >Set filters
                          </button>
                          <ShowModalSetDialogFactorFilters></ShowModalSetDialogFactorFilters>
                          {renderDialogVariableFactorsTable()}
                        </div>
                      }
                      </div>
                      <div id="file-uploader">
                      <button 
                        className='dialog-factors-button'
                        onClick={(event) => toggleDatabaseTargetsTable(event)}>
                        {showDatabaseTargetsTable?'Hide':'Upload factor data'}
                      </button>
                      {!showDatabaseTargetsTable ? <div /> :
                        <select
                          value={currentSourceFileTarget}
                          onChange={(event) => this.handleFileTargetDropdownChange(event, handleSourceFileTargetChange)}
                        >
                        <option value="scenariofolder">Copy files to scenario folder</option>
                          <option value="databasetables">Copy files to model database tables</option>
                        {currentSourceFileTarget}
                        </select>}                          
                        {!showDatabaseTargetsTable ? <div/> : <div>
                          <div>
                            <ShowModalTable></ShowModalTable>
                            {currentSourceFileTarget==='scenariofolder'?
                            <div>
                              {renderScenarioInputsSourceFiles()}
                            </div> :
                            <div>
                              {renderScenarioInputsSourceTargetTable()}
                            </div>}
                          </div>
                          <BasicDropArea handleDropEvents = {handleDropEvents} updateScenarioState = {this.updateScenarioState} />       
                          </div>
                        }
                      </div>
                      <button 
                        onClick={(e) => this.handleScenarioSubmissionClick(e, handleSubmitSimulationScenario)} 
                        disabled={!validationObjects[validationObjects.findIndex(obj => obj.name==="SubmitScenarioButton")].enabled}
                        className="btn btn-primary"
                        id="submit-simulation-scenario"> 
                        Submit simulation scenario
                      </button>
                      {this.state.scenarioSubmitted ?
                        <div>
                          <label
                            htmlFor="scenario-run-status" 
                            className="scenario-input-labels">Scenario run status:
                          </label>
                          <output 
                            name="scenarioRunStatus" 
                            className="scenario-inputs-output-fields" 
                            id="scenario-run-status">{scenarioRunStatus}
                          </output>
                        </div> : <div></div>}
                    </LoadingOverlay>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </UserContext.Consumer>
      )
      : <Redirect to="/login" />  
    );
  }
}

export default ScenarioSetup;
