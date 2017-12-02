import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import fav16 from "../assets/img/favicon-16x16.png";
import fav32 from "../assets/img/favicon-32x32.png";
import leftLogo from "../assets/img/LeftLogoAnim.png";
import rightLogo from "../assets/img/RightLogoAnim.png";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 2000);
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="app">
        {loading && window.innerWidth > 500 ? (
          <div className={`app__loader app__loader_${loading}`}>
            <div className="app__loader-wrapper">
              <img className="app__leftLogo" src={leftLogo} alt="" />
              <div className="app__right">
                <img className="app__rightLogoMain" src={rightLogo} alt="" />
              </div>
            </div>
          </div>
        ) : null}

        <div className="app__children">{this.props.children}</div>
      </div>
    );
  }
}
