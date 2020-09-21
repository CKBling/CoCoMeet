import React, { Component } from 'react';
import Tools from './tools/Tools';
import Board from './board/Board';
import MenuBar from "./menu/menu-bar-sun";
import AppChat from "./chat/AppChat";
import HeaderBar from "./header/header-bar-sun";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

class Main extends Component {
  render() {
    return (
      <div>
        <HeaderBar />
        <MenuBar />
        <SplitterLayout primaryIndex={1} secondaryInitialSize={200}>
          <Tools />
          <SplitterLayout secondaryInitialSize={350}>
            <Board />
            <AppChat/>
          </SplitterLayout>
        </SplitterLayout>
      </div>
    );
  }
}

export default Main;