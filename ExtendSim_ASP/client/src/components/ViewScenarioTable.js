import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import UserContext from '../utils/UserContext'; 
 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById("root"))
 
class ViewScenarioTable extends React.Component {
  static contextType = UserContext;
  constructor() {
    super();
 
    this.state = {
      modalIsOpen: false
    };
 
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
 
  openModal(event) {
    event.preventDefault();
    const { currentSelectedExtendSimModel} = this.context;
    alert(currentSelectedExtendSimModel.FullPath);
    this.setState({modalIsOpen: true});
  }
 
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});
  }
 
  render() {
    // const { currentSelectedExtendSimModel } = this.context;

    return (
      <UserContext.Consumer>{({currentSelectedExtendSimModel}) => (
        <div>
          <button onClick={event => this.openModal(event)}>View</button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >  
            <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
            <button onClick={this.closeModal}>close</button>
            <div>I am a modal</div>
            <form>
              <div>{currentSelectedExtendSimModel.currentSelectedExtendSimModel.scenarioInputsTableData[this.props.index].table}</div>
              <input />
              <button>tab navigation</button>
              <button>stays</button>
              <button>inside</button>
              <button>the modal</button>
            </form>
          </Modal> 
        </div>
      )};</UserContext.Consumer>
    );
  }
}
 
ReactDOM.render(<ViewScenarioTable></ViewScenarioTable>, document.getElementById("root"));

export default ViewScenarioTable;