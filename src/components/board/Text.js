import React, { Component } from 'react';

//NOT USED
//Temp file

class Text extends Component {
  constructor(props) {
    super(props);

    this.state = {
        text: "dummy"
    };
    this.showinfo = this.showinfo.bind(this);
    this.edit = this.edit.bind(this)
  }
  showinfo(){
      alert(this.state.text)
  }
  edit(){
    this.setState({text: "dummy changed"});
  }
  render() {
    return (
      <div>
          {this.state.text}
          
          <button onClick={this.showinfo}>Info</button>
          <button onClick={this.edit}>Edit</button>
      </div>
    );
  }
}

export default Text;