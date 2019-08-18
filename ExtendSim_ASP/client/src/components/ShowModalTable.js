import React from 'react';
// import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import Modal from 'react-modal';
import UserContext from '../utils/UserContext'; 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    maxWidth              : '800px',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
Modal.setAppElement(document.getElementById("root"))
class ShowModalTable extends React.Component {
  static contextType = UserContext;
  state = {
  }
  handleButtonClick(event) {
    event.preventDefault();
    const { toggleModal } = this.context;
    console.log(this.context);
    toggleModal(this.props, event);
  }
  render() {
    const {showModalTable, currentSelectedExtendSimModel, setCellColumnWidth} = this.context;
    var columns = [];
    var rowIndex = currentSelectedExtendSimModel.currentSelectedTableRow;
    if (rowIndex >= 0) {
      var rows = [];
      var tablefields = currentSelectedExtendSimModel.scenarioInputsTableData[rowIndex].tablefields;
      currentSelectedExtendSimModel.scenarioInputsTableData[rowIndex].tableRows.forEach(function(row) {
        var myRowObject = {};
        for (var i=0;i<row.length;i++) {
          myRowObject[tablefields[i]] = row[i];
        }
        console.log('ShowModalTable: myRowObject=' +myRowObject);
        rows.push(myRowObject);
      })
    }

    if (!showModalTable) {
      return null;
    } else {
      currentSelectedExtendSimModel.scenarioInputsTableData[rowIndex].tablefields.map(function(field, index) {
        var columnWidth = setCellColumnWidth(field, field, 16);
        var columnObject = {
          Header: field,
          accessor: field,
          width: {columnWidth},
          maxWidth: 300,
          minResizeWidth: 150,
          style: {
            'font-size': 16,
            'textAlign': 'left'
          },
          resizable: true
        }
        columns.push(columnObject);
      return true});  
    return (
      <UserContext.Consumer>{({ showModalTable, renderModalTable, renderScenarioInputsSourceTargetTable, currentSelectedExtendSimModel }) => (
          <Modal
            isOpen={showModalTable}
            style={customStyles}
            contentLabel="Example Modal"
          >  
          {/* <Draggable> */}
            <h2 ref={subtitle => this.subtitle = subtitle}>{currentSelectedExtendSimModel.scenarioInputsTableData[currentSelectedExtendSimModel.currentSelectedTableRow].tablename}</h2>
            <button onClick={(event) => this.handleButtonClick(event)}>close</button>
            <ReactTable
              data={rows}
              columns={columns}
              defaultPageSize={rows.length}
              // pageSize = {currentSelectedExtendSimModel.scenarioInputsTableData.length}
              // pageSizeOptions = {[4, 8]}
              className="-striped -highlight"
            />
            {/* </Draggable> */}
          </Modal> 
        )}
    </UserContext.Consumer>
    )}
  }
}

export default ShowModalTable;