import React, { Component } from 'react';

  class AppChannel extends Component {
    updateName(event){
      if(event.target.value!==this.props.uname) this.props.onUpdate_name(event.target.value);
    }
    keyUpdateName(event){
      if(event.keyCode===13) {
          if(event.target.value!==this.props.uname) this.props.onUpdate_name(event.target.value);
      }
    }
    render() {
      return (
          <header className="Name-header">
            <h1 className="Name-title">Welcome to cocoMeet</h1>
            <input type="text" className="uname" placeholder="user name" onBlur={this.updateName.bind(this)} onKeyDown={this.keyUpdateName.bind(this)}/>
          </header>
      );
    }
  }
  
  export default AppChannel;