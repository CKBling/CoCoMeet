import React, { Component } from 'react';
import { Input } from 'react-bootstrap';
import './Channel.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:4002');

class AppChannel extends Component {
  constructor(props) {
    super(props);
    this.updateConnected = this.updateConnected.bind(this)
    this.updateChannel = this.updateChannel.bind(this);
    this.keyUpdateChannel = this.keyUpdateChannel.bind(this);
}
  updateConnected(){
    if(this.props.connected==='False') this.props.onUpdate_connect('True')
  }
  updateChannel(event){
    if(event.target.value!==this.props.channel) this.props.onUpdate_channel(event.target.value);
  }
  keyUpdateChannel(event){
    if(event.keyCode===13) {
        if(event.target.value!==this.props.channel) this.props.onUpdate_channel(event.target.value);
    }
  }
  render() {
    return (
        <header className="Channel-header">
          <input type="text" className="channel" placeholder="channel name" onBlur={this.updateChannel} onKeyDown={this.keyUpdateChannel}/>
          <button type="button" className="btn btn-primary" onClick={this.updateConnected(this)}>입장</button>
        </header>
    );
  }
}

export default AppChannel;