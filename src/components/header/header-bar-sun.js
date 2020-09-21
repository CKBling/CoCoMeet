import React from "react";

const Header = props => {
  return <div className="header-bar">{props.name}</div>;
};

export default class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="menu-bar">
        <Header name="CoCoMeet" />
      </div>
    );
  }
}
