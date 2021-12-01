import React from "react";
import Guide from "../components/guide/guide";
import { downloadObjectAsJson } from "../utils";
import DivElement from "../utils/div-element";

export default class Home extends React.Component {
  state = {
    elements: new DivElement(),
    _elements: null,
  };
  render() {
    const { elements, addElement, _elements } = this.state;
    return (
      <div className="home-body">
        <ColorComp
          element={elements}
          updateElements={(update) => {
            this.setState({ _elements: update });
          }}
        />
        {elements.color === null || addElement ? (
          <Guide
            initialize={elements.color === null}
            setElements={(elements) => {
              this.setState({ elements, _elements: elements });
            }}
            close={() => {
              this.setState({ addElement: false });
            }}
          />
        ) : (
          ""
        )}
        {elements.color ? (
          <button
            className="export"
            onClick={async () => {
              await setTimeout(() => {
                const string = JSON.stringify(_elements);

                downloadObjectAsJson(JSON.parse(string), "colors");
              }, 200);
            }}
          >
            Export JSON
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

class ColorComp extends React.Component {
  state = {
    addElement: false,
    _elements: null,
  };

  render() {
    const { element, updateElements } = this.props;
    const { addElement } = this.state;
    return element.color ? (
      <>
        <div className="parent" style={{ backgroundColor: element.color }}>
          {element.childTop && element.childBottom ? (
            <div className="child">
              <ColorComp
                element={element.childTop}
                editAt={(addElement) => {
                  element.childTop = addElement;
                  this.setState({ element });
                }}
                updateElements={(elem) => {
                  const el = element.childTop;
                  el.childTop = elem.childTop;
                  el.childBottom = elem.childBottom;
                  element.childTop = el;
                  this.props.updateElements(element);
                }}
              />
              <ColorComp
                element={element.childBottom}
                updateElements={(elem) => {
                  const el = element.childBottom;
                  el.childTop = elem.childTop;
                  el.childBottom = elem.childBottom;
                  element.childBottom = el;
                  this.props.updateElements(element);
                }}
                editAt={(addElement) => {
                  element.childBottom = addElement;
                  this.setState({ element });
                }}
              />
            </div>
          ) : (
            <button
              onClick={async () => {
                await setTimeout(() => {
                  this.setState({ addElement: element });
                }, 200);
              }}
            >
              ➕
            </button>
          )}
        </div>
        {addElement ? (
          <Guide
            addElement={addElement}
            setElements={(elements) => {
              const { element } = this.props;
              element.childTop = element.childTop;
              element.childBottom = element.childBottom;
              this.props.updateElements(elements);
              this.setState({ elements });
            }}
            close={() => {
              this.setState({ addElement: false });
            }}
          />
        ) : (
          ""
        )}
      </>
    ) : (
      ""
    );
  }
}
