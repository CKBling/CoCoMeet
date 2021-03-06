import React, { Component } from 'react';
import ColorTools from './tools/ColorTools';
import TextTools from './tools/TextTools';
import Tools from './tools/Tools';
import BoardInternal from './board/BoardInternal';
import EditableText from './board/EditableText';
import ChatView from './chat/ChatView_sun';
import Channel from './chat/Channel';
import Name from './chat/Name';
import HeaderBar from './header/header-bar-sun';
import 'react-splitter-layout/lib/index.css';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { getFlatDataFromTree, getTreeFromFlatData } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import io from 'socket.io-client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const socket = io('http://localhost:4002/board_server');
class Main extends Component {
  constructor(props) {
    super(props);
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    Array.from(Array(5)).forEach(() => {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    })
    this.state = {
      channel:this.props.history.location.state.channel, 
      uname:this.props.history.location.state.uname, channel_code: this.props.history.location.state.channel_code,
      room_id: this.props.history.location.state.room_id,
      connected:'False', msg_to_block:'Click Chat Balloon',
      treenum: 2,
      lefttree: {treeID: '0', treeData: [{title: "dummy0"}]},
      righttree: {treeID: '1', treeData: [{title: "dummy1"}]},
      leftModifying: false, //수정중일 때 true
      rightModifying: false, //수정중일 때 true
      getcolor: "cyan",
      LeftcheckedList: [],
      RightcheckedList: [],
      lastMoveNodeLeft: "NULL",
      lastMoveNodeRight: "NULL",
      expandList: Array.apply(null, Array(1024)).map(i=>false),
    };
    this.onDropLeft = this.onDropLeft.bind(this);
    this.onDropRight = this.onDropRight.bind(this);
    this.updateNodeLeft = this.updateNodeLeft.bind(this);
    this.updateNodeRight = this.updateNodeRight.bind(this);
    this.updateTreeLeft = this.updateTreeLeft.bind(this);
    this.updateTreeRight = this.updateTreeRight.bind(this);
    this.LeftmovedNodeIs = this.LeftmovedNodeIs.bind(this);
    this.RightmovedNodeIs = this.RightmovedNodeIs.bind(this);
    this.modifyState = this.modifyState.bind(this);
    this.modifyExpandList = this.modifyExpandList.bind(this);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.updateName = this.updateName.bind(this);
    this.updateChannel = this.updateChannel.bind(this);
    this.updateConnected = this.updateConnected.bind(this);
    this.updateMsgToBlock = this.updateMsgToBlock.bind(this);

    this.printDocument = this.printDocument.bind(this);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.toFlatDataFrom = this.toFlatDataFrom.bind(this);
    this.toFlatIDDataFrom = this.toFlatIDDataFrom.bind(this);
    this.toTreeDataFrom = this.toTreeDataFrom.bind(this);
    this.receive_sendtree = this.receive_sendtree.bind(this);
    this.getAttrToBoard = this.getAttrToBoard.bind(this);
    this.getListFromBoard = this.getListFromBoard.bind(this);
    this.find_parent_of = this.find_parent_of.bind(this);
    this.applytoTree = this.applytoTree.bind(this);
    this.find_node_and_replace = this.find_node_and_replace.bind(this)
  }

  find_node_and_replace=(new_node, tree_data)=>{
    // console.log(tree_data)
    for(var i=0, node; node=tree_data[i]; i++){
      // console.log(node.node_id)
      if (new_node.node_id === node.node_id){
        tree_data[i] = new_node
        return tree_data
      }
      else {
        if (node.children !== undefined) {
          let result = this.find_node_and_replace(new_node, node.children)
          if(result){
            tree_data[i]['children'] = result
            return tree_data
          }
        }
      }
    }
    return false;
  }

  applytoTree=(tree_id, new_node)=>{
    // new_node['expanded']=this.state.expandList[parseInt(new_node.node_id)]
    new_node = {node_id: new_node.node_id, expanded: this.state.expandList[parseInt(new_node.node_id)],
        title: <EditableText modify={this.modifyState} channel={this.state.channel} room_id={new_node.room_id} tree_id={tree_id} node_id={new_node.node_id} initialValue={new_node.title}/>, 
        color: new_node.color, weight: new_node.weight, deco: new_node.deco,
        parent: new_node.parent, tree_id: new_node.tree_id}
    console.log("input tree_id, cur left, right", tree_id,this.state.lefttree.treeID,this.state.righttree.treeID)
    if (this.state.lefttree.treeID ===tree_id){
      console.log("apply new-node to tree left")
      // traverse left tree
      var ltree = this.state.lefttree.treeData
      var new_tree = this.find_node_and_replace(new_node,ltree)
      if (new_tree)
        this.setState({lefttree:{treeID: tree_id, treeData:new_tree}})
    }else if (this.state.righttree.treeID ===tree_id){
      console.log("apply new-node to tree right")
      // traverse right tree
      var rtree = this.state.righttree.treeData
      var new_tree = this.find_node_and_replace(new_node,rtree)
      if (new_tree)
        this.setState({righttree:{treeID: tree_id, treeData:new_tree}})
      console.log("apply new-node to tree right")
      // traverse right tree
      var rtree = this.state.righttree.treeData
      var new_tree = this.find_node_and_replace(new_node,rtree)
      if (new_tree)
        this.setState({righttree:{treeID: tree_id, treeData:new_tree}})
      console.log("apply new-node to tree right")
      // traverse right tree
      var rtree = this.state.righttree.treeData
      var new_tree = this.find_node_and_replace(new_node,rtree)
      if (new_tree)
        this.setState({righttree:{treeID: tree_id, treeData:new_tree}})
      console.log("apply new-node to tree right")
      // traverse right tree
      var rtree = this.state.righttree.treeData
      var new_tree = this.find_node_and_replace(new_node,rtree)
      if (new_tree)
        this.setState({righttree:{treeID: tree_id, treeData:new_tree}})
      console.log("apply new-node to tree right")
      // traverse right tree
      var rtree = this.state.righttree.treeData
      var new_tree = this.find_node_and_replace(new_node,rtree)
      if (new_tree)
        this.setState({righttree:{treeID: tree_id, treeData:new_tree}})
      console.log("apply new-node to tree right")
      // traverse right tree
      var rtree = this.state.righttree.treeData
      var new_tree = this.find_node_and_replace(new_node,rtree)
      if (new_tree)
        this.setState({righttree:{treeID: tree_id, treeData:new_tree}})
      console.log("apply new-node to tree right")
      // traverse right tree
      var rtree = this.state.righttree.treeData
      var new_tree = this.find_node_and_replace(new_node,rtree)
      if (new_tree)
        this.setState({righttree:{treeID: tree_id, treeData:new_tree}})
      console.log("apply new-node to tree right")
      // traverse right tree
      var rtree = this.state.righttree.treeData
      var new_tree = this.find_node_and_replace(new_node,rtree)
      if (new_tree)
        this.setState({righttree:{treeID: tree_id, treeData:new_tree}})
    }
  }
  


  toTreeDataFrom=(flat, tree_id)=>{
    return getTreeFromFlatData({
      flatData: flat.map(node => ({ ...node, node_id: node.node_id, expanded: this.state.expandList[parseInt(node.node_id)],
        title: <EditableText modify={this.modifyState} channel={this.state.channel} room_id={node.room_id} tree_id={tree_id} node_id={node.node_id} initialValue={node.title}/>, 
                          color: node.color, weight: node.weight, deco: node.deco })),
      getKey: node => node.node_id,
      getParentKey: node => node.parent, 
      rootKey: 'NULL', 
    });
  }
  toFlatDataFrom=(tree)=>{
    //console.log(tree)
    return getFlatDataFromTree({
      treeData: tree,
      getNodeKey: ({ node }) => node.node_id, 
      ignoreCollapsed: false, 
    }).map(({ node, path }) => ({
      node_id: node.node_id,

      // The last entry in the path is this node's key
      // The second to last entry (accessed here) is the parent node's key
      parent: path.length > 1 ? path[path.length - 2] : 'NULL',
    }));
  }
  toFlatIDDataFrom=(tree)=>{
    return getFlatDataFromTree({
      treeData: tree,
      getNodeKey: ({ node }) => node.node_id, 
      ignoreCollapsed: false, 
    }).map(({ node }) => (node.node_id));
  }
  receive_sendtree = (tree_leftright, data) =>{
    const treeID = data.treeid;
    //console.log("inside receive send tree", treeID)
    if(tree_leftright==='L'){
      const left_tree = this.toTreeDataFrom(data.tree, treeID);
      //console.log("data treenum from server", data.treenum)
      if(data.treenum === undefined){
        this.setState({lefttree: {treeID: treeID, treeData: left_tree}});
      }else{
        this.setState({treenum: data.treenum, lefttree: {treeID: treeID, treeData: left_tree}});
      }
    }else if(tree_leftright==='R'){
      const right_tree = this.toTreeDataFrom(data.tree, treeID);
      if(data.treenum === undefined){
        this.setState({righttree: {treeID: treeID, treeData: right_tree}});
      }else{
        this.setState({treenum: data.treenum, righttree: {treeID: treeID, treeData: right_tree}});
      }
    }
  }

  find_parent_of=(id,flat)=>{
    return flat.find(i => i.node_id === id).parent
  }
  
  componentDidMount(){
    let cursor = this;
    // 방 들어왔을 때 실행되는 코드
    // channel uname ... 설정하는 코드
    // console.log("미스테리우스")
    socket.emit('channelJoin',{channel: cursor.state.channel, room_id: cursor.state.room_id})
    
    socket.on('addTree', function(data){
      cursor.setState({treenum: data.treenum})
    })
    /////////////////////////////////////////////한중한테 emit한 cli한테 다시 보내기
    socket.on('changeTree',function(data){
      // console.log('Here on Change, we check received data',data)
      // console.log("Here ON Change Tree [droped tree] [left tree] [right tree]", data.treeid, cursor.state.lefttree.treeID, cursor.state.righttree.treeID)
      if(data.treeid === cursor.state.lefttree.treeID){
        if (!cursor.state.leftModifying){
          cursor.receive_sendtree('L', data);
          // console.log("left main data change tree to", data)
        }
        //cursor.setState({lefttree: cursor.toTreeDataFrom(data.tree)})
      }else if(data.treeid === cursor.state.righttree.treeID){
        if (!cursor.state.rightModifying){
          cursor.receive_sendtree('R', data);
          // console.log("right main data change tree to", data)
        }
        //cursor.setState({righttree: cursor.toTreeDataFrom(data.tree)})
      }
    })
    socket.on('sendTree', function(data){
      // console.log("sendTree rannnn")
      //move, migrate, sunsapple, delete, addnode
      const treeID = data.treeid;
      // console.log('sendTree data from server',data)
      if(treeID === cursor.state.lefttree.treeID){
        if (!cursor.state.leftModifying){
          cursor.receive_sendtree('L', data);
        }
      }else if(treeID === cursor.state.righttree.treeID){
        if (!cursor.state.rightModifying){
          cursor.receive_sendtree('R', data);
        }
      }
    })
    socket.on('sendNode', function(data){
      //changetext, changeattr
      console.log("sendNode서니", data)
      const treeID = data.treeid; //'0'
      // console.log("창열: ", cursor.state.lefttree.treeID, cursor.state.righttree.treeID, data.treeid)
      if(treeID === cursor.state.lefttree.treeID){
        // console.log("left 들어옴")
        if (!cursor.state.leftModifying){
          // console.log("left 또 들어왔지롱")
          cursor.applytoTree(treeID, data.node); //new_node= data.node_id
        }
      }else if(treeID === cursor.state.righttree.treeID){
        // console.log("right 들어옴")
        if (!cursor.state.rightModifying){
          // console.log("right 또 들어왔지롱")
          cursor.applytoTree(treeID, data.node);
        }
      }
    })
  }
  
  addTree =()=>{
    var data = {}
    data["room_id"]=this.state.room_id;
    data["channel"]=this.state.channel;
    socket.emit('addTree',data)
  }
  LeftmovedNodeIs = (node_id, prev_tree, prevIndex, nextIndex, prevPath, nextPath) =>{
    // console.log("LeftmovedNodeIS")
    if (node_id === '-1') {
      //suns-apple
      // title : this.state.msg_to_block
      console.log("left suns apple")
      var data={};
      var send_tree_flat = this.toFlatDataFrom(this.state.lefttree.treeData);
      data["room_id"]=this.state.room_id;
      data["tree_id"]=this.state.lefttree.treeID;
      data["tree"]=send_tree_flat
      data["node_title"]=this.state.msg_to_block;
      data["channel"]=this.state.channel;
      var parent_id=this.find_parent_of('-1',send_tree_flat)
      data["node_parent"]=parent_id
      if (parent_id!='NULL') this.modifyExpandList(parent_id,true)
      socket.emit("sunsApple", data)
    }
    else if (node_id===this.state.lastMoveNodeRight){
      // this node moved from left to right. emit "migrateNode"
      console.log("left to right... EMIT!")
      this.setState({lastMoveNodeRight: "NULL"})
      // if this migrated node is in LeftcheckedList, remove!
      var left_test_checked = this.state.LeftcheckedList;
      this.setState({LeftcheckedList: left_test_checked.filter(targetValue => targetValue !==parseInt(node_id))});
      var data = {}
      data["room_id"]=this.state.room_id;
      data["node_id"]=node_id;
      data["origin_tree"]=this.toFlatDataFrom(this.state.lefttree.treeData);
      data["origin_tree_id"]=this.state.lefttree.treeID;
      var target_tree_flat =this.toFlatDataFrom(this.state.righttree.treeData);
      data["target_tree"]=target_tree_flat;
      data["target_tree_id"]=this.state.righttree.treeID;
      data["channel"]=this.state.channel;
      var parent_id=this.find_parent_of(node_id,target_tree_flat)
      data["node_parent"]=parent_id
      if (parent_id!='NULL') this.modifyExpandList(parent_id,true)
      socket.emit("migrateNode", data);

    }
    else { // if this.state.lastMoveNodeRight==="NULL"
      var prev_flat = this.toFlatIDDataFrom(prev_tree);
      //var prev_flat_for_sending = this.toFlatDataFrom(prev_tree)
      if (prevIndex === nextIndex){
        //  then this node moved from right to left
        //  or this node moved inside left or did not move
        if (!prev_flat.includes(node_id)){
          this.setState({lastMoveNodeLeft: node_id})
          console.log("right->left")
        }
        else {
          if (JSON.stringify(prevPath)===JSON.stringify(nextPath)){
            console.log("did not moved")
          }
          else {
            var cur_flat = this.toFlatIDDataFrom(this.state.lefttree.treeData);
            var cur_flat_for_sending = this.toFlatDataFrom(this.state.lefttree.treeData)
            if (!cur_flat.includes(node_id)){
              // prev_flat에는 있는데 cur_flat에는 없으면 delete
              console.log("left deleted...EMIT!")
              var data = {};
              data["room_id"]=this.state.room_id;
              data["node_id"]=node_id;
              data["tree_id"]=this.state.lefttree.treeID;
              data["tree"]=cur_flat_for_sending;
              data["channel"]=this.state.channel;
              socket.emit("deleteNode", data);
            }
            else {
              // prev flat에도 있고 cur_flat에도 있고.
              console.log("indentation move inside left...EMIT!")
              // console.log("prev and cur respectively",prev_flat_for_sending,cur_flat_for_sending)
              var data = {};
              data["room_id"]=this.state.room_id;
              data["node_id"]=node_id;
              data["tree_id"]=this.state.lefttree.treeID;
              data["tree"]=cur_flat_for_sending;
              //원래는 prev
              data["channel"]=this.state.channel;
              var parent_id=this.find_parent_of(node_id,cur_flat_for_sending)
              data["node_parent"]=parent_id
              if (parent_id!='NULL') this.modifyExpandList(parent_id,true)
              socket.emit("moveNode", data);
            }
          }
        }
      }
      
      else if (prevIndex!==nextIndex){
        //console.log('left prev flat',prev_flat);
        if (prev_flat.includes(node_id)){
          var cur_flat = this.toFlatIDDataFrom(this.state.lefttree.treeData);
          var cur_flat_for_sending = this.toFlatDataFrom(this.state.lefttree.treeData)
          if (!cur_flat.includes(node_id)){
            // prev_flat에는 있는데 cur_flat에는 없으면 delete
            console.log("left deleted...EMIT!")
            var data = {};
            data["room_id"]=this.state.room_id;
            data["node_id"]=node_id;
            data["tree_id"]=this.state.lefttree.treeID;
            data["tree"]=cur_flat_for_sending;
            data["channel"]=this.state.channel;
            socket.emit("deleteNode", data);
          }
          else {
            console.log("move inside left...EMIT!")
            var data = {};
            data["room_id"]=this.state.room_id;
            data["node_id"]=node_id;
            data["tree_id"]=this.state.lefttree.treeID;
            data["tree"]=cur_flat_for_sending;
            data["channel"]=this.state.channel;
            var parent_id=this.find_parent_of(node_id,cur_flat_for_sending)
            data["node_parent"]=parent_id
            if (parent_id!='NULL') this.modifyExpandList(parent_id,true)
            socket.emit("moveNode", data);
          }
        }
        else {
          // this node is from right. (left에는 없었다)
          // 즉 right->left.
          // right에서 "migrateNode" emit
          this.setState({lastMoveNodeLeft: node_id})
          console.log("right->left")
        }
      }
    }

  }
  RightmovedNodeIs = (node_id, prev_tree, prevIndex, nextIndex, prevPath, nextPath) =>{
    // console.log("RIghtmovedNodeIS")
    if (node_id === '-1') {
      //suns-apple
      // title : this.state.msg_to_block
      console.log("right suns apple")
      var data={};
      var send_tree_flat = this.toFlatDataFrom(this.state.righttree.treeData);
      data["room_id"]=this.state.room_id;
      data["tree_id"]=this.state.righttree.treeID;
      data["tree"]=send_tree_flat
      data["node_title"]=this.state.msg_to_block
      data["channel"]=this.state.channel;
      var parent_id=this.find_parent_of('-1',send_tree_flat)
      data["node_parent"]=parent_id
      if (parent_id!='NULL') this.modifyExpandList(parent_id,true)
      socket.emit("sunsApple", data)
    }
    else if (node_id===this.state.lastMoveNodeLeft){
      // this node moved from right to left. emit "migrateNode"
      console.log("right->left...EMIT!")
      this.setState({lastMoveNodeLeft: "NULL"})
      // if this migrated node is in RightcheckedList, remove!
      var right_test_checked = this.state.RightcheckedList;
      this.setState({RightcheckedList: right_test_checked.filter(targetValue => targetValue !==parseInt(node_id))});
      var data = {}
      data["room_id"]=this.state.room_id;
      data["node_id"]=node_id;
      data["origin_tree"]=this.toFlatDataFrom(this.state.righttree.treeData);
      data["origin_tree_id"]=this.state.righttree.treeID;
      var target_tree_flat =this.toFlatDataFrom(this.state.lefttree.treeData);
      data["target_tree"]=target_tree_flat
      data["target_tree_id"]=this.state.lefttree.treeID;
      data["channel"]=this.state.channel;
      var parent_id=this.find_parent_of(node_id,target_tree_flat)
      data["node_parent"]=parent_id
      if (parent_id!='NULL') this.modifyExpandList(parent_id,true)
      socket.emit("migrateNode", data);

    }
    else { // if this.state.lastMoveNodeLeft===NULL
      var prev_flat = this.toFlatIDDataFrom(prev_tree);
      // var prev_flat_for_sending = this.toFlatDataFrom(prev_tree);
      if (prevIndex === nextIndex){
        //  then this node moved from left to right 
        //  or this node moved inside right or did not move
        if (!prev_flat.includes(node_id)){ // ['1', '2', '3'] [{},{},{}]
          this.setState({lastMoveNodeRight: node_id})
          console.log("left->right")
        }
        else {
          if (JSON.stringify(prevPath)===JSON.stringify(nextPath)){
            console.log("did not moved")
          }
          else {
            var cur_flat = this.toFlatIDDataFrom(this.state.righttree.treeData);
            var cur_flat_for_sending = this.toFlatDataFrom(this.state.righttree.treeData);
            if (!cur_flat.includes(node_id)){
              // prev_flat에는 있는데 cur_flat에는 없으면 delete
              console.log("right deleted...EMIT!")
              var data = {};
              data["room_id"]=this.state.room_id;
              data["node_id"]=node_id;
              data["tree_id"]=this.state.righttree.treeID;
              data["tree"]=cur_flat_for_sending;
              data["channel"]=this.state.channel;
              socket.emit("deleteNode", data);
            }
            else {
              console.log("indentation move inside right...EMIT!")
              // console.log("prev and cur respectively",prev_flat_for_sending,cur_flat_for_sending)
              var data = {};
              data["room_id"]=this.state.room_id;
              data["node_id"]=node_id;
              data["tree_id"]=this.state.righttree.treeID;
              data["tree"]=cur_flat_for_sending;
              //원래는 prev
              data["channel"]=this.state.channel;
              var parent_id=this.find_parent_of(node_id,cur_flat_for_sending)
              data["node_parent"]=parent_id
              this.modifyExpandList(parent_id,true)
              socket.emit("moveNode", data);
            }
          }
        }
      }
      
      else if (prevIndex!==nextIndex){
        //console.log('right prev flat',prev_flat);
        if (prev_flat.includes(node_id)){
          var cur_flat = this.toFlatIDDataFrom(this.state.righttree.treeData);
          var cur_flat_for_sending = this.toFlatDataFrom(this.state.righttree.treeData);
          if (!cur_flat.includes(node_id)){
            // prev_flat에는 있는데 cur_flat에는 없으면 delete
            console.log("right deleted...EMIT!")
            var data = {};
            data["room_id"]=this.state.room_id;
            data["node_id"]=node_id;
            data["tree_id"]=this.state.righttree.treeID;
            data["tree"]=cur_flat_for_sending;
            data["channel"]=this.state.channel;
            socket.emit("deleteNode", data);
          }
          else {
            console.log("inside right move...EMIT!")
            // moved inside right "moveNode"
            var data = {};
            data["room_id"]=this.state.room_id;
            data["node_id"]=node_id;
            data["tree_id"]=this.state.righttree.treeID;
            data["tree"]=cur_flat_for_sending;
            data["channel"]=this.state.channel;
            var parent_id=this.find_parent_of(node_id,cur_flat_for_sending)
            data["node_parent"]=parent_id
            if (parent_id!='NULL') this.modifyExpandList(parent_id,true)
            socket.emit("moveNode", data);
          }
          
        }
        else {
          // this node is from left. (left에는 없었다)
          // 즉 left->right.
          // left에서 "migrateNode" emit
          this.setState({lastMoveNodeRight: node_id})
          console.log("left->right")
        }
      }
    }

  }

  updateTreeLeft = (newtreeData, tree_id) => {
    //console.log("left main", newtreeData);
    this.setState({lefttree:{treeID: this.state.lefttree.treeID, treeData: newtreeData}});

  }
  updateTreeRight = (newtreeData, tree_id) =>{
    //console.log("right main", newtreeData);
    this.setState({righttree:{treeID: this.state.righttree.treeID, treeData: newtreeData}});
  }
  updateNodeLeft = () => {
    let cursor = this;
    // addblock
    // left tree 마지막에 "block with id -1" 추가
    var addnode_lefttree = this.state.lefttree.treeData;
    addnode_lefttree = addnode_lefttree.concat(
      [{ node_id: "-1", title: "dummy", color: "cyan", weight: "normal", deco: "none"}]
    )
    socket.emit("addNode", {channel: cursor.state.channel, room_id: this.state.room_id, tree_id: this.state.lefttree.treeID, tree: this.toFlatDataFrom(addnode_lefttree)});
  }
  updateNodeRight = () => {
    let cursor = this;
    // addblock
    // left tree 마지막에 "block with id -1" 추가
    var addnode_righttree = this.state.righttree.treeData;
    addnode_righttree = addnode_righttree.concat(
      [{ node_id: "-1", title: "dummy", color: "cyan", weight: "normal", deco: "none"}]
    )
    
    socket.emit("addNode", {channel: cursor.state.channel, room_id: this.state.room_id, tree_id: this.state.righttree.treeID, tree: this.toFlatDataFrom(addnode_righttree)});
  }
  onDropLeft = (tree_id) => {
    if (tree_id === this.state.righttree.treeID){
      return
    }
    console.log("left drop...",tree_id,typeof(tree_id))
    if (tree_id !== this.state.lefttree.treeID) {
      let ttree = this.state.lefttree
      ttree['treeID'] = tree_id
      this.setState({lefttree: ttree})
      // console.log("befre change tree, we set lefttree id to", tree_id)
      socket.emit('changeTree', {channel: this.state.channel, room_id: this.state.room_id, tree_id: tree_id});
    }
  }
  onDropRight = (tree_id) => {
    if(tree_id === this.state.lefttree.treeID){
      return
    }
    console.log("right drop...",tree_id) 
    if (tree_id !== this.state.righttree.treeID) {
      let ttree = this.state.righttree
      ttree['treeID'] = tree_id
      this.setState({righttree: ttree})
      // console.log("befre change tree, we set righttree id to", tree_id)
      socket.emit('changeTree', {channel: this.state.channel, room_id: this.state.room_id, tree_id: tree_id});
    }
  }
  
  modifyExpandList=(node_id,expanded)=>{
    //expand = true/false
    // console.log("node_id",node_id, expanded)
    let expandedList = this.state.expandList
    if (expanded) {
      expandedList[parseInt(node_id)]=true
      this.setState({expandList: expandedList})
    }
    else {
      expandedList[parseInt(node_id)]=false
      this.setState({expandList: expandedList})
    }
  }
  getAttrToBoard = (get_attr, msg) => {
    //data = {tree_id_list: {1: [1,3,4], 3:[6,2,5,7]}, color: "cyan"}
    var attr = {};
    var checkedList = this.state.LeftcheckedList;
    checkedList = checkedList.concat(this.state.RightcheckedList)
    // checkedList[this.state.lefttree.treeID]=this.state.LeftcheckedList;
    // checkedList[this.state.righttree.treeID]=this.state.RightcheckedList;
    attr["node_list"]=checkedList;
    if (msg==='c'){
      //this.setState({get_color: get_attr});
      attr["color"]=get_attr;
    } else if (msg==='d') {
      //this.setState({get_deco: get_attr});
      attr["deco"]=get_attr;
    } else if (msg ==='w') {
      //this.setState({get_weight: get_attr});
      attr["weight"]=get_attr;
    }
    attr["room_id"]=this.state.room_id;
    attr["channel"]=this.state.channel;
    console.log(attr);
    socket.emit('changeAttribute',attr);
  }
  getListFromBoard = (tree_id, node_id, isChecked) => {
    var left_test_checked = this.state.LeftcheckedList;
    var right_test_checked = this.state.RightcheckedList;
    if(tree_id === this.state.lefttree.treeID){
      if(isChecked !== false){
        this.setState({LeftcheckedList: left_test_checked.concat(node_id)});
      }else{
        this.setState({LeftcheckedList: left_test_checked.filter(targetValue => targetValue !==node_id)});
      }
    }else if(tree_id === this.state.righttree.treeID){
      if(isChecked !== false){
        this.setState({RightcheckedList: right_test_checked.concat(node_id)});
      }else{
        this.setState({RightcheckedList: right_test_checked.filter(targetValue => targetValue !==node_id)});
      }
    }
  }
  modifyState = (tree_id, flag) => {
    if (tree_id === this.state.lefttree.treeID){
      this.setState({leftModifying: flag})
    }else if(tree_id === this.state.righttree.treeID){
      this.setState({rightModifying: flag})
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateName(uname){
    this.setState({uname: uname});
  }
  updateChannel(channel){
    this.setState({channel: channel});
  }
  updateConnected(value){
    this.setState({connected:value});
  }
  updateMsgToBlock(msg_to_block){
    this.setState({msg_to_block: msg_to_block});
  }
  
  printDocument(id) {
    //alert('function in');
    const input = document.getElementById(id);
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("tree_"+id+"_pdf.pdf");
      });
  }

  render() {
    return (
      <div>
        <HeaderBar />
        <div className="h-full">
          <DndProvider backend={HTML5Backend}>
            <div >
                <div className="flex m-4 ">
                    <div className="w-1/9 p-3">
                        <div className="h-quaterscreen">
                            <div className="mb-6 pb-3 shadow-md bg-gray-100 h-1/5">
                              <div className="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                                <div className="font-sans text-lg font-semibold text-teal-500">Channel</div>
                              </div>
                              <Name uname = {this.state.uname} onUpdate_name2={this.updateName} channel_code={this.state.channel_code}/>
                              <Channel channel={this.state.channel} connected={this.state.connected} onUpdate_channel2={this.updateChannel} onUpdate_connect2={this.updateConnected} /> 
                            </div>
                            <div className="mb-6 pb-3 shadow-md bg-gray-100 h-1/5">
                              <div className="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                                <div className="font-sans text-lg font-semibold text-teal-500">Block Colors</div>
                              </div>
                              <ColorTools sendColor={this.getAttrToBoard}/>
                            </div>
                            <div className="mb-6 pb-3 shadow-md bg-gray-100 h-1/5">
                              <div className="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                                <div className="font-sans text-lg font-semibold text-teal-500">Font Style</div>
                              </div>
                              <TextTools sendDeWe={this.getAttrToBoard}/>
                            </div>
                            <div className="mb-6 pb-3 shadow-md bg-gray-100 h-1/5">
                              <div className="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                                <div className="font-sans text-lg font-semibold text-teal-500">Tree Lists</div>
                              </div>
                              <div className="ml-3">
                                <button className="bg-transparent border-transparent text-blue-500 font-extrabold hover:underline py-2" onClick={this.addTree} >Add New Tree</button>
                                <div className="pl-2">
                                  <Tools treenum={this.state.treenum} tree1={this.state.lefttree.treeID} tree2={this.state.righttree.treeID}/>
                                  
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-3/9 p-3">
                        <div className="shadow-md bg-gray-100 h-quaterscreen">
                          <div className="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                            <div className="font-sans text-lg font-semibold text-teal-500">Left Tree</div>
                          </div>
                          <BoardInternal tree={this.state.lefttree} sendChecked={this.getListFromBoard} movedNodeIs={this.LeftmovedNodeIs}
                          msg_to_block={this.state.msg_to_block} printPDF={this.printDocument} toggle={this.modifyExpandList}
                          onDrop={this.onDropLeft} updateNode={this.updateNodeLeft} updateTree={this.updateTreeLeft}/>
                        </div>
                    </div>
                    <div className="w-3/9 p-3">
                        <div className="shadow-md bg-gray-100 h-quaterscreen">
                          <div className="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                            <div className="font-sans text-lg font-semibold text-teal-500">Right Tree</div>
                          </div>
                          <BoardInternal tree={this.state.righttree} sendChecked={this.getListFromBoard} movedNodeIs={this.RightmovedNodeIs}
                          msg_to_block={this.state.msg_to_block} printPDF={this.printDocument} toggle={this.modifyExpandList}
                          onDrop={this.onDropRight} updateNode={this.updateNodeRight} updateTree={this.updateTreeRight}/>
                        </div>
                    </div>
                    <div className="w-2/9 p-3">
                        <div className="shadow-md bg-gray-100 h-quaterscreen">
                          <div className="border-b-2 border-gray-300 bg-gray-200 h-12 p-3 mb-3">
                            <div className="font-sans text-lg font-semibold text-teal-500">Chat</div>
                          </div>
                          <ChatView uname = {this.state.uname} channel={this.state.channel} connected={this.state.connected} OnupdateMsgToBlock={this.updateMsgToBlock}/> 
                        </div>
                    </div>
                </div>
            </div>
          </DndProvider>
        </div>
      </div>
    );
  }
}

export default Main;