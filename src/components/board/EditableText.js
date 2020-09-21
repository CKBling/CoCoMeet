import React, { Component } from 'react';

class EditableText extends Component{
    constructor(props){
      super(props)
      this.state = {
        text: props.initialValue,
        isEditable: false
      }
    }
  
  changeEditMode = () => {
    this.setState({
      edit: !this.state.edit
    })
  } // false인 edit의 상태를 true로 바꿔주는 역할

  handleChange = (event) => {
    this.setState({
      text: event.target.value
    })
  }
  handleKeyDown = (event) => {
    if(event.key === "Enter"){
      this.setState({
        edit: !this.state.edit
      }) 
  // 만약 입력된 값을 상위 컴포넌트에서 저장/관리한다면, 저장하는 함수를 여기서 실행한다.
    }
  }
  render(){
    return(
      <div className="row list">
      {this.state.edit ? 
      (<input className="form-control" type="text" 
              value={this.state.text} 
              onChange={(event) => this.handleChange(event)} 
              onKeyDown = {this.handleKeyDown} />)
      :
      (<span onDoubleClick={() => this.changeEditMode()}>
          {this.state.text}</span>)}
      </div>
  )}
}

export default EditableText;