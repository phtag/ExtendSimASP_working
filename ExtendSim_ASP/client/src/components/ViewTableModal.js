import React from "react";
export default class ViewTableModal extends React.Component {
    state = {
        show: false
    }
  showModal(currentSelectedExtendSimModel, event) {
      event.preventDefault();
      this.setState({ show: true });
      alert("Hello - props.tableRow=" + this.props.tableRow._index + " currentSelectedExtendSimModel.FullPath=" + currentSelectedExtendSimModel.FullPath);
  }
    render() {
        if(!this.state.show) {
            return (<button onClick={event => this.showModal(this.props.currentSelectedExtendSimModel, event)}>View</button>);
        } else {
            return (<div>Modal</div>);
        }
    }
}