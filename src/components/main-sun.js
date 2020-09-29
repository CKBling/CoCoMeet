import React, { Component } from 'react';
import Tools from './tools/Tools';
import Board from './board/Board';
import MenuBar from "./menu/menu-bar-sun";
import ChatView from './chat/ChatView';
import Channel from './chat/Channel';
import Name from './chat/Name';
import HeaderBar from "./header/header-bar-sun";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

class Main extends Component {
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
        <HeaderBar />
        <MenuBar />
        <SplitterLayout primaryIndex={1} secondaryInitialSize={200}>
          <div>
            <h2><Name uname = {this.state.uname} onUpdate_name2={this.updateName} /></h2>
            <h3><Channel channel={this.state.channel} connected={this.state.connected} onUpdate_channel2={this.updateChannel} onUpdate_connect2={this.updateConnected} /> </h3>
          </div>
          <SplitterLayout secondaryInitialSize={350}>
            <SplitterLayout percentage='true'><Board /><Board /></SplitterLayout>
            <ChatView uname = {this.state.uname} channel={this.state.channel} connected={this.state.connected}/>
          </SplitterLayout>
        </SplitterLayout>
      </div>
    );
  }
}

export default Main;