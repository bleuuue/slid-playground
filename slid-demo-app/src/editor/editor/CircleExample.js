import React from "react";
import reactCSS from "reactcss";
import { CirclePicker, SketchPicker } from "react-color";
import Swal from "sweetalert2";
import SweetAlert from "react-bootstrap-sweetalert";

class CircleExample extends React.Component {
  state = {
    color: {
      r: this.props.color.r,
      g: this.props.color.g,
      b: this.props.color.b,
      a: this.props.color.a,
    },
  };

  // showColorPickerPopup = () => {
  //   Swal.fire({
  //     title: "popup",
  //   });
  // };
  handleClick = () => {
    this.props.setDisplayColorPicker(!this.props.displayColorPicker);
    // <SweetAlert title={"색상을 선택하세요"}>
    //   <CirclePicker color={this.state.color} colors={["rgba(255, 19, 0, 1)", "rgba(236, 120, 120, 1)", "rgba(156, 39, 176, 1)"]} onChange={this.handleChange} />
    // </SweetAlert>;
    // Swal.fire({
    //   target: document.getElementById("toast-container"),
    //   title: "Title",
    //   text: "hi",
    //   html: '<CirclePicker color={${this.state.color}} colors={["rgba(255, 255, 255, 1)", "rgba(0, 0, 0, 0.3)"]} onChange={${this.handleChange}} />',
    //   position: "center",
    //   heightAuto: false,
    // }).then(() => {});
    // this.showColorPickerPopup();
  };

  handleClose = () => {
    this.props.setDisplayColorPicker(false);
  };

  handleChange = (color) => {
    this.props.setColor(color.rgb);
    this.setState({ color: color.rgb });
    this.handleClose();
  };

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: `rgba(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b}, ${this.props.color.a})`,
        },
        // swatch: {
        //   padding: "5px",
        //   background: "#fff",
        //   borderRadius: "50%",
        //   boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        //   display: "inline-block",
        //   cursor: "pointer",
        // },
        popover: {
          position: "absolute",
          zIndex: "2",
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });

    const colorArray = [
      "rgba(255, 19, 0, 1)",
      "rgba(236, 120, 120, 1)",
      "rgba(156, 39, 176, 1)",
      "rgba(103, 58, 183, 1)",
      "rgba(63, 81, 181, 1)",
      "rgba(0, 112, 255, 1)",
      "rgba(3, 169, 244, 1)",
      "rgba(0, 188, 212, 1)",
      "rgba(76, 175, 80, 1)",
      "rgba(139, 195, 74, 1)",
      "rgba(205, 220, 57, 1)",
      "rgba(255, 229, 0, 1)",
      "rgba(255, 191, 0, 1)",
      "rgba(255, 152, 0, 1)",
      "rgba(121, 85, 72, 1)",
      "rgba(158, 158, 158, 1)",
      "rgba(90, 90, 90, 1)",
      "rgba(33, 37, 41, 1)",
    ];

    const highlightColorArray = [
      "rgba(255, 19, 0, 0.3)",
      "rgba(236, 120, 120,0.3)",
      "rgba(156, 39, 176, 0.3)",
      "rgba(103, 58, 183, 0.3)",
      "rgba(63, 81, 181, 0.3)",
      "rgba(0, 112, 255, 0.3)",
      "rgba(3, 169, 244, 0.3)",
      "rgba(0, 188, 212, 0.3)",
      "rgba(76, 175, 80, 0.3)",
      "rgba(139, 195, 74, 0.3)",
      "rgba(205, 220, 57, 0.3)",
      "rgba(255, 229, 0, 0.3)",
      "rgba(255, 191, 0, 0.3)",
      "rgba(255, 152, 0, 0.3)",
      "rgba(121, 85, 72, 0.3)",
      "rgba(158, 158, 158, 0.3)",
      "rgba(90, 90, 90, 0.3)",
      "rgba(33, 37, 41, 0.3)",
    ];

    // const colorObjectArray = [
    //   {
    //     r: 255,
    //     g: 19,
    //     b: 0,
    //     a: 1,
    //   },
    //   {
    //     r: 236,
    //     g: 120,
    //     b: 120,
    //     a: 1,
    //   },
    // ];

    return (
      <div id="test">
        <div onClick={this.handleClick}>
          <button type="button" className={`btn btn-light`}>
            <div style={styles.color} />
          </button>
        </div>
        {this.props.displayColorPicker ? (
          <SweetAlert title={"색상을 선택하세요"} onConfirm={this.onConfirm} onCancel={this.onCancel} showConfirm={false}>
            {this.props.highlightColorPicker ? (
              <CirclePicker color={this.state.color} colors={highlightColorArray} width="100%" onChange={this.handleChange} />
            ) : (
              <CirclePicker color={this.state.color} colors={colorArray} width="100%" onChange={this.handleChange} />
            )}
          </SweetAlert>
        ) : null}
      </div>
    );
  }
}

export default CircleExample;
