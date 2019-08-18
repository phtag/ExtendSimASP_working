import React from 'react';
import Modal from 'react-modal';
import UserContext from '../utils/UserContext'; 
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    height: '400px',
    maxWidth: '800px',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'auto'
  }
};
Modal.setAppElement(document.getElementById("root"))
class ShowModalSetDialogFactorFilters extends React.Component {
  static contextType = UserContext;
  state = {
    selectedOption: null,

  }
  handleButtonClick(event, toggleFunction) {
    event.preventDefault();
    toggleFunction(event);
  }
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(JSON.stringify(selectedOption));
  };
  render() {
    const {showModalDialogFactorsFilters, currentSelectedExtendSimModel} = this.context;
    if (!showModalDialogFactorsFilters) {
      return null;
    } else { 
        alert('currentSelectedExtendSimModel.modelInfo.length=' + currentSelectedExtendSimModel.modelInfo.length);
        var nodes = [];
        currentSelectedExtendSimModel.modelInfo.forEach(function(block, index) {
            var matchIndex = nodes.findIndex(function(node) {
                return node.value === block.blockName;
            })
            if (matchIndex < 0) {
                alert('Adding new node w/block.blockName=' + block.blockName);
                nodes.push(
                { 
                    value: block.blockName, 
                    label: block.blockName, 
                    blockLabel: block.blockLabel,
                    blockNumber: block.blockNumber,
                    tabname: block.tabname,
                    enclosingHblockNumber: -1,
                    enclosingHblockLabel: block.enclosingHblockLabel,
                    children: [] 
                });
            }
            else {
                var matchHblockIndex = nodes[matchIndex].children.findIndex(function(child) {
                    return child.enclosingHblockNumber === block.enclosingHblockNumber;
                });
                if ((matchHblockIndex < 0) || (block.enclosingHblockNumber === undefined)) {
                    alert('Adding to existing node w/block.blockName=' + block.blockName);

                    nodes[matchIndex].children.push(
                    { 
                        value: block.blockName, 
                        label: block.blockName, 
                        blockLabel: block.blockLabel,
                        blockNumber: block.blockNumber,
                        tabname: block.tabname,
                        enclosingHblockNumber: block.enclosingHblockNumber,
                        enclosingHblockLabel: block.enclosingHblockLabel,
                        children: [] 
                    });    
                } else {
                    alert('matchHblockIndex=' + matchHblockIndex + ' nodes[matchIndex].children[matchHblockIndex].enclosingHblockNumber=' + nodes[matchIndex].children[matchHblockIndex].blockNumber);
                    nodes[matchIndex].children[matchHblockIndex].children.push(
                    { 
                        value: block.blockName, 
                        label: block.blockName, 
                        blockLabel: block.blockLabel,
                        blockNumber: block.blockNumber,
                        tabname: block.tabname,
                        enclosingHblockNumber: block.enclosingHblockNumber,
                        enclosingHblockLabel: block.enclosingHblockLabel,
                        children: [] 
                    });                       
                };
            }
        });          
    };
    return (
      <UserContext.Consumer>{({ showModalDialogFactorsFilters, 
                                toggleDialogFactorFiltersModal }) => (
          <Modal
            isOpen={showModalDialogFactorsFilters}
            style={customStyles}
            contentLabel="Example Modal"
          > 
            <div>
                <button onClick={(event) => this.handleButtonClick(event, toggleDialogFactorFiltersModal)}>Close</button>
                <h2>Set filters for dialog variables to be displayed in dialog factors table</h2>
                <div className='my-checkbox-tree'>
                    <CheckboxTree
                        nodes={nodes}
                        checked={this.state.checked}
                        expanded={this.state.expanded}
                        onCheck={checked => this.setState({ checked })}
                        onExpand={expanded => this.setState({ expanded })}
                    />
                </div>
            </div>
          </Modal> 
        )}
    </UserContext.Consumer>
    )}
}

export default ShowModalSetDialogFactorFilters;