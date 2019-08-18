import React from 'react';
import { Beforeunload } from 'react-beforeunload';
import { Redirect } from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import UserContext from '../utils/UserContext'; 

class ScenariosSummary extends React.Component {
  static contextType = UserContext;

  state = {
    isActive: false
  };


  myfunction = () => {
  }
  handleShowResultsClick = (ShowScenarioResults, event) => {
    event.preventDefault();
    const { history } = this.props;
    const rowIndex = event.target.getAttribute('row');
    this.setState({ isActive: true }, 
                  ShowScenarioResults(event, rowIndex, history));
  }

  handleDeleteScenarioClick = (handleDeleteScenario, event) => {
    event.preventDefault();
    const { history } = this.props;
    const scenarioID = event.target.getAttribute('name');

    handleDeleteScenario(event, scenarioID, history);
  }

  render() {
    const { user } = this.context;

    return (
      user 
      ? (
      <UserContext.Consumer>
        {({
            renderUserScenariosTableData,
            getUserScenarios,
            handleTableSelectionDeleteScenario,
            handleTableSelectionShowScenarioResults
        }) => (
          <div id="home">
            <LoadingOverlay
              active={this.state.isActive}
              spinner
              text='Retrieving results from server...'>
            <Beforeunload onBeforeunload={this.myfunction} />
            <div className="container my-scenario-container">
              <div className="row">
                <header id="ExtendSim-header">
                </header>
              </div>
              <div className="row no-gutters">
                <div className="col-12">
                  <h2>Scenarios Summary</h2>
                  <table id='scenarios-summary-table' border="1">
                  <thead>
                    <tr>
                        <th className="table-headers">Scenario ID</th>
                        {/* <th className="table-headers">User Login Session ID</th> */}
                        <th className="table-headers">Scenario Name</th>
                        <th className="table-headers">Username</th>
                        <th className="table-headers">Scenario Submission Date/Time</th>
                        <th className="table-headers">Scenario Completion Date/Time</th>
                        <th className="table-headers">Results</th>
                        <th className="table-headers">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                      {renderUserScenariosTableData(
                        (event) => this.handleShowResultsClick(handleTableSelectionShowScenarioResults, event),
                        (event) => this.handleDeleteScenarioClick(handleTableSelectionDeleteScenario, event))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            </LoadingOverlay>
          </div>
        )}
      </UserContext.Consumer>
      )
      : <Redirect to="/login" />     
    );
  }
}

export default ScenariosSummary;
