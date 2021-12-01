import React from "react";
import { createPortal } from "react-dom";
import { isBrowser } from "../../utils";
import { SketchPicker } from "react-color";
import DivElement from "../../utils/div-element";

export default class Guide extends React.Component {
  state = {
    portalLoaded: false,
    pickSingeColor: false,
    pickDoubleColor: false,
    colors: {
      _1: "#000",
      _2: "#fff",
    },
  };

  componentDidUpdate() {
    const { pickSingeColor, pickDoubleColor } = this.state;
    if (pickSingeColor || pickDoubleColor) {
      this.portal.className = this.props.initialize
        ? "guide-body white"
        : "guide-body";
    }
  }

  mount() {
    this.portal = isBrowser ? document.createElement("div") : "";
    this.root = isBrowser ? document.getElementById("root") : "";
    this.portal.className = `guide-body ${
      this.props.initialize ? "welcome" : ""
    }`;
    this.root.appendChild(this.portal);
    this.setState({ portalLoaded: true });
  }

  async componentDidMount() {
    this.mount();
  }

  async close() {
    this.portal.id = "close";
    await setTimeout(() => {
      this.props.close();
      this.root.removeChild(this.portal);
    }, 450);
  }

  render() {
    return this.state.portalLoaded
      ? createPortal(this.display(), this.portal)
      : "";
  }

  display = () => {
    const { pickSingeColor, pickDoubleColor } = this.state;
    const { initialize } = this.props;
    return (
      <div className="guide-box">
        {initialize ? (
          !pickSingeColor && !pickDoubleColor ? (
            <>
              <h2>Getting Started</h2>
              <p>
                By clicking next you will be required to selecct the background
                colour for the root div node. Futher instructions will follow.
                Do you wish to proceed ?
              </p>
              <button
                onClick={async () =>
                  await setTimeout(() => {
                    this.setState({ pickSingeColor: true });
                  }, 300)
                }
              >
                Yes
              </button>
            </>
          ) : pickSingeColor ? (
            this.#pickSingeColor()
          ) : pickDoubleColor ? (
            this.#pickDoubleColor()
          ) : (
            ""
          )
        ) : (
          this.#pickDoubleColor()
        )}
      </div>
    );
  };

  #pickSingeColor = () => {
    const { initialize, setElements } = this.props;
    const { colors } = this.state;
    return (
      <div className={`single-pick ${initialize ? "restart" : ""}`}>
        <h2>Select Parent Color</h2>
        <SketchPicker
          color={colors._1}
          onChangeComplete={(selectedColor) => {
            colors._1 = selectedColor.hex;
            this.setState({ colors });
          }}
        />
        <button
          onClick={async () =>
            await setTimeout(async () => {
              if (initialize) {
                const x = new DivElement();
                x.color = colors._1;
                setElements(x);
                await this.close();
              }
            }, 300)
          }
        >
          Proceed
        </button>
      </div>
    );
  };
  #pickDoubleColor = () => {
    const { initialize, addElement, setElements } = this.props;
    const { colors } = this.state;
    return (
      <div className={`double-pick ${initialize ? "restart" : ""}`}>
        <h2>Select Child Colors</h2>
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <div>
            <p>Bottom Color</p>
            <SketchPicker
              color={colors._1}
              onChangeComplete={(selectedColor) => {
                colors._1 = selectedColor.hex;
                this.setState({ colors });
              }}
            />
          </div>
          <div style={{ width: "20px" }} />
          <div>
            <p>Top Color</p>
            <SketchPicker
              color={colors._2}
              onChangeComplete={(selectedColor) => {
                colors._2 = selectedColor.hex;
                this.setState({ colors });
              }}
            />
          </div>
        </div>
        <div className="btns">
          <button
            onClick={async () =>
              await setTimeout(async () => {
                await this.close();
              }, 300)
            }
          >
            Close
          </button>
          <button
            onClick={async () =>
              await setTimeout(async () => {
                const _addElement = addElement;
                _addElement.childBottom = new DivElement();
                _addElement.childBottom.color = colors._1;
                _addElement.childTop = new DivElement();
                _addElement.childTop.color = colors._2;
                setElements(_addElement);
                await this.close();
              }, 300)
            }
          >
            Proceed
          </button>
        </div>
      </div>
    );
  };
}
