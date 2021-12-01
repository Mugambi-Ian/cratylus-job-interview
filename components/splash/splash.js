import React from "react";
import { createPortal } from "react-dom";
import { isBrowser } from "../../utils";

export default class Splash extends React.Component {
  state = {
    showLogo: undefined,
    portalLoaded: false,
  };

  mount() {
    this.portal = isBrowser ? document.createElement("div") : "";
    this.root = isBrowser ? document.getElementById("root") : "";
    this.portal.className = "splash-body on-start";
    this.root.appendChild(this.portal);
    this.setState({ portalLoaded: true });
  }

  async componentDidMount() {
    this.mount();
    await this.startScene();
  }

  async startScene() {
    await setTimeout(async () => {
      this.setState({ showLogo: true });
      await setTimeout(async () => await this.endScene(), 2500);
    }, 1000);
  }

  async endScene() {
    this.setState({ showLogo: false });
    await setTimeout(async () => {
      this.portal.className = "splash-body on-exit";
      await setTimeout(() => {
        this.root.removeChild(this.portal);
        this.props.isShown();
      }, 450);
    }, 500);
  }

  render() {
    return this.state.portalLoaded
      ? createPortal(this.logo(), this.portal)
      : "";
  }

  logo = () => {
    const { showLogo } = this.state;
    return (
      <img
        className={
          showLogo !== undefined ? (showLogo === true ? "start" : "stop") : ""
        }
        alt="Cratylus Logo"
        src="/img/logo.jpg"
      />
    );
  };
}
