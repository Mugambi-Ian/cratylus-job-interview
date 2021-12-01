import "../css/_list.css";

import React from "react";
import Splash from "../components/splash/splash";
import Head from "next/head";

export default function Application({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Cratylus Job Interview</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CratylusJobInterView
        child={(props) => <Component {...pageProps} {...props} />}
      />
    </>
  );
}

class CratylusJobInterView extends React.Component {
  state = {
    splashShown: false,
  };

  render() {
    return (
      <div id="root" className="main-body">
        {this.state.splashShown === true ? (
          <this.props.child />
        ) : (
          <Splash
            isShown={() => {
              this.setState({ splashShown: true });
            }}
          />
        )}
      </div>
    );
  }
}
