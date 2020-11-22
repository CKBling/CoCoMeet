import React, { Component } from 'react';

class EditableText extends Component{
    constructor(props){
      super(props)
      this.state = {
        text: props.initialValue,
        edit: false
      }
      //this.textInput = React.createRef();
    }
  
  changeEditMode = (event) => {
    this.setState({
      edit: true
    })
    //document.getElementById(`${this.props.node_id}`).focus(); 
  } // false인 edit의 상태를 true로 바꿔주는 역할
  handleChange = (event) => {
    this.setState({
      text: event.target.value
    })
  }
  handleKeyDown = (event) => {
    if(event.key === "Enter"){
      this.setState({
        edit: false
      }) 
      // socket emit
      
  // 만약 입력된 값을 상위 컴포넌트에서 저장/관리한다면, 저장하는 함수를 여기서 실행한다.
    }
  }
  handleBlur = () => {
    console.log("blurrrrrr")
    this.setState({
      edit: false
    }) 
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ text: nextProps.initialValue });
  }
  render(){
    return(
      <div className="row list">
      {this.state.edit ? 
      (<input className="form-control" type="text" 
              value={this.state.text} 
              onChange={(event) => this.handleChange(event)} 
              onKeyDown = {this.handleKeyDown} 
              onBlur = {this.handleBlur}
              />)
      :
      (<span  onClick={() => this.changeEditMode()} >
          {this.state.text}</span>)}
      </div>
  )}
}

export default EditableText;
