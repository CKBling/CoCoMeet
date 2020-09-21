import React, { Component } from 'react';
import Name from './Name'
import Channel from './Channel';
import ChatView from './ChatView';

class AppChat extends Component { 
  constructor(props) {
    super(props);
    this.state = {channel:'cocomeet', uname:'Yonsei', connected:'False'};
    this.updateName = this.updateName.bind(this);
    this.updateChannel = this.updateChannel.bind(this);
    this.updateConnected = this.updateConnected.bind(this);
  }
  updateName(uname){
    this.setState({uname: uname});
  }
  updateChannel(channel){
    this.setState({channel: channel});
  }
  updateConnected(value){
    this.setState({connected:value});
  }
  render() {
      return (
        <div>
            <Name uname = {this.state.uname} onUpdate_name={this.updateName} />
            <Channel channel={this.state.channel} connected={this.state.connected} onUpdate_channel={this.updateChannel} onUpdate_connect={this.updateConnected} />
            <ChatView uname = {this.state.uname} channel={this.state.channel} connected={this.state.connected}/>
        </div>
      );
  }
}

export default AppChat