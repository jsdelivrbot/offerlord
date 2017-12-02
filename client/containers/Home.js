import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import Button from "../components/Button/Button.js";
import ButtonDownload from "../components/ButtonDownload/ButtonDownload.js";
import Modal from "../components/Modal/Modal.js";
import MailBlock from "./MailBlock/MailBlock.js";

import * as addBlock from "../redux/actions/addBlock";
import * as removeBlock from "../redux/actions/removeBlock";
import * as checkboxSwitch from "../redux/actions/checkboxSwitch";
import * as ttState from "../redux/actions/tooltip";
import * as modalState from "../redux/actions/modal";
import * as modalFirstTime from "../redux/actions/modalFirstTime";

import appLogo from "../assets/img/logo.png";
import faqLink from "../assets/img/question.png";
import addIcon from "../assets/img/add_icon.png";

import "./Home.css";

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  update() {
    let data = JSON.stringify(this.props.dataToBackend);
    return fetch("/downloaddata", {
      method: "post",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(this.checkStatus)
      .then(this.gotoUrl);
  }

  gotoUrl() {
    window.location = "/download";
  }
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  modalToggle() {
    this.props.actions.modalAction.modalState(this.props.modalStateStore);
    this.props.actions.modalFirstTimeAction.modalFirstTime(false);
  }

  enableTutorial() {
    this.props.actions.tooltipAction.ttState(this.props.ttStateStore);
    this.props.actions.modalAction.modalState(this.props.modalStateStore);
  }

  handleChange(event) {
    this.props.actions.checkboxSwitchAction.checkboxSwitch(
      this.props.formsReducer.checkbox
    );
  }

  onAddBtnClick(event) {
    let form = {
      mainText: "",
      heading: "",
      image: "",
      buttonName: "",
      buttonLink: ""
    };
    this.props.actions.addBlockAction.addBlock(form);
  }

  onRemoveBtnClick(event) {
    this.props.actions.removeBlockAction.removeBlock(event);
  }

  render() {
    return (
      <div className="container">
        <div className="home__main">
          {this.props.formsReducer.forms.map((item, index) => {
            return (
              <MailBlock
                defaultHeading={this.props.formsReducer.forms[index].heading}
                defaultMainText={this.props.formsReducer.forms[index].mainText}
                defaultImage={this.props.formsReducer.forms[index].image}
                defaultButtonName={
                  this.props.formsReducer.forms[index].buttonName
                }
                defaultbuttonLink={
                  this.props.formsReducer.forms[index].buttonLink
                }
                id={index}
                key={index}
                onRemoveBtnClick={::this.onRemoveBtnClick}
              />
            );
          })}
        </div>

        <div data-tip="Вы можете скачать письмо сразу после завершения редактирования">
          <nav className="home__navigation">
            <img className="home__logo" src={appLogo} alt="maillord.logo" />
            {/* <img
              data-tip="Отключить подсказки"
              onClick={::this.enableTutorial}
              className="home__faqLink"
              src={faqLink}
              alt=""
            /> */}
            <ButtonDownload
              buttonType={"button__download"}
              data={"Скачать"}
              onClickEvent={::this.update}
            />
          </nav>
        </div>
        {this.props.ttStateStore ? <ReactTooltip /> : null}
        {this.props.modalFirstTimeStore && this.props.modalStateStore ? (
          <Modal onClosing={::this.modalToggle} />
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataToBackend: state.formsReducer,
    formsReducer: state.formsReducer,
    ttStateStore: state.tooltipReducer.ttState,
    modalStateStore: state.modalReducer.modalState,
    modalFirstTimeStore: state.modalReducer.modalFirstTime
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      addBlockAction: bindActionCreators(addBlock, dispatch),
      removeBlockAction: bindActionCreators(removeBlock, dispatch),
      checkboxSwitchAction: bindActionCreators(checkboxSwitch, dispatch),
      tooltipAction: bindActionCreators(ttState, dispatch),
      modalAction: bindActionCreators(modalState, dispatch),
      modalFirstTimeAction: bindActionCreators(modalFirstTime, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
