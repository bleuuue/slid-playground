import React, { useState, useEffect, useRef } from "react";
import styles from "./editor.module.css";
import { fabric } from "fabric";
import Swal from "sweetalert2";
import CircleExample from "./CircleExample";
import "./editor.css";

const MarkupModal = (props) => {
  const { markupModalOpen, markupImgUrl, handleSaveMarkupImage, handleMarkupModalClose } = props;
  const markupCanvasRef = useRef();
  const [penWidth, setPenWidth] = useState(5);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [highlightColorPicker, setHighlightColorPicker] = useState(false);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const canvasContainerRef = useRef();
  const [penWidthState, setPenWidthState] = useState("small");
  const [cursorState, setCursorState] = useState("pen");
  const [isRedoing, setIsRedoing] = useState(false);
  let markupObjects = [];

  useEffect(() => {
    if (markupModalOpen) {
      var markupImg = new Image();
      markupImg.src = markupImgUrl;

      let canvasWidth, canvasHeight;

      let canvasContainerWidth = canvasContainerRef.current.offsetWidth;

      if (markupImg.width > markupImg.height) {
        canvasWidth = canvasContainerWidth;
        canvasHeight = (canvasContainerWidth * markupImg.height) / markupImg.width;
      } else {
        const fixedHeight = window.innerHeight - (196 + 100);
        canvasHeight = fixedHeight;
        canvasWidth = (fixedHeight * markupImg.width) / markupImg.height;

        if (canvasWidth > canvasContainerWidth) {
          canvasWidth = canvasContainerWidth;
          canvasHeight = (canvasContainerWidth * markupImg.height) / markupImg.width;
        }
      }

      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = canvasWidth;
      tmpCanvas.height = canvasHeight;
      let ctx = tmpCanvas.getContext("2d");
      ctx.drawImage(markupImg, 0, 0, markupImg.width, markupImg.height, 0, 0, canvasWidth, canvasHeight);

      let newUrl = tmpCanvas.toDataURL();

      markupCanvasRef.current = new fabric.Canvas("markup-canvas", {
        width: canvasWidth,
        height: canvasHeight,
        backgroundImage: newUrl,
        isDrawingMode: true,
        freeDrawingCursor: "url(../../../design/assets/slid_pen_cursor.png) 0 0, auto",
      });

      markupCanvasRef.current.on("object:added", () => {
        if (!isRedoing) {
          markupObjects = [];
        }
        setIsRedoing(false);
      });

      markupCanvasRef.current.freeDrawingBrush.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      markupCanvasRef.current.freeDrawingBrush.width = penWidth;

      canvasContainerRef.current.tabIndex = 1000;
      canvasContainerRef.current.addEventListener(
        "keydown",
        (event) => {
          console.log(event.key);
          switch (event.key) {
            case "Backspace":
            case "Delete":
              if (markupCanvasRef.current.isDrawingMode) return;
              const activeObj = markupCanvasRef.current.getActiveObject();
              if (activeObj) {
                if (activeObj._objects) {
                  activeObj._objects.forEach((activeObj) => {
                    markupCanvasRef.current.remove(activeObj);
                  });
                  markupCanvasRef.current.discardActiveObject().renderAll();
                } else {
                  markupCanvasRef.current.remove(activeObj);
                }
              }
              break;
            default:
              return;
          }
        },
        false
      );
      document.addEventListener("click", markupModalClickEvent);

      return () => {
        document.removeEventListener("click", markupModalClickEvent);
      };
    }
  }, [markupModalOpen]);

  useEffect(() => {
    if (displayColorPicker) {
      document.addEventListener("click", circlePickerClickEvent);
    } else {
      document.removeEventListener("click", circlePickerClickEvent);
    }
    return () => {
      document.removeEventListener("click", circlePickerClickEvent);
    };
  }, [displayColorPicker]);

  useEffect(() => {
    if (markupCanvasRef.current !== undefined) {
      if (cursorState === "highlighter") {
        markupCanvasRef.current.freeDrawingBrush.width = penWidth * 3;
      } else {
        markupCanvasRef.current.freeDrawingBrush.width = penWidth;
      }
      markupCanvasRef.current.freeDrawingBrush.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }
  }, [color, penWidth]);

  const undo = () => {
    if (markupCanvasRef.current._objects.length > 0) {
      markupObjects.push(markupCanvasRef.current._objects.pop());
      markupCanvasRef.current.renderAll();
    }
  };

  const redo = () => {
    if (markupObjects.length > 0) {
      setIsRedoing(true);
      markupCanvasRef.current.add(markupObjects.pop());
    }
  };

  const markupModalClickEvent = (e) => {
    if (markupModalOpen) {
      if (document.getElementById("modal").contains(e.target)) {
        if (document.getElementById("markupContainer").contains(e.target)) {
        } else {
          handleMarkupModalClose();
        }
      }
    }
  };

  const circlePickerClickEvent = (e) => {
    if (e.target.id === "modal") {
      document.removeEventListener("click", circlePickerClickEvent);
      document.removeEventListener("click", markupModalClickEvent);
      setDisplayColorPicker(false);
      handleMarkupModalClose();
      return;
    }

    if (document.getElementsByClassName("sweet-alert")[0].parentElement.contains(e.target)) {
      setDisplayColorPicker(false);
    }
  };

  const cursorClick = () => {
    setCursorState("cursor");
    markupCanvasRef.current.isDrawingMode = false;
    markupCanvasRef.current.defaultCursor = "url(../../../design/assets/slid_select_cursor.png) 0 0, auto";
  };

  const penClick = () => {
    setCursorState("pen");
    markupCanvasRef.current.isDrawingMode = true;
    markupCanvasRef.current.defaultCursor = "url(../../../design/assets/slid_pen_cursor.png) 0 0, auto";
    markupCanvasRef.current.freeDrawingCursor = "url(../../../design/assets/slid_pen_cursor.png) 0 0, auto";
    setHighlightColorPicker(false);
    setColor({
      ...color,
      a: 1,
    });
  };

  const highlightingClick = () => {
    setCursorState("highlighter");
    setHighlightColorPicker(true);
    markupCanvasRef.current.isDrawingMode = true;
    setColor({
      ...color,
      a: 0.3,
    });
    markupCanvasRef.current.freeDrawingCursor = "url(../../../design/assets/slid_highlighter_cursor.png) 0 0, auto";
  };

  const textBtnClick = () => {
    let PLACE_HOLDER = "텍스트 입력";
    setHighlightColorPicker(false);
    setColor({
      ...color,
      a: 1,
    });

    const textbox = new fabric.Textbox(PLACE_HOLDER, {
      left: 10,
      top: 10,
      fontSize: 20,
      fontWeight: 600,
      width: 120,
      textAlign: "center",
      fontFamily: "sans-serif",
      charSpacing: 50,
      cornerStyle: "circle",
      cornerColor: "rgb(0, 0, 0)",
      fill: "rgb(178, 204, 255)",
      cornerStrokeColor: "rgb(178, 204, 255)",
      borderDashArray: [2],
      cornerSize: 8,
      fill: `rgba(${color.r}, ${color.g}, ${color.b})`,
    });

    textbox.on({
      "editing:entered": () => {
        if (textbox.text === PLACE_HOLDER) {
          textbox.selectAll();
          textbox.removeChars(0, 10);
        }
      },
      "editing:exited": () => {
        if (textbox.text === "") {
          textbox.insertChars(PLACE_HOLDER);
        }
      },
    });

    markupCanvasRef.current.add(textbox);
    markupCanvasRef.current.setActiveObject(textbox);
    // text.enterEditing();
    // text.hiddenTextarea.focus();
    // markupCanvasRef.current.renderAll();

    // markupCanvasRef.current.on("mouse:down", function (e) {
    //   if (e.target !== null) {
    //     if (e.target.text === "텍스트 입력") {
    //       e.target.text = "";
    //     }
    //   }
    // });
    // markupCanvasRef.current.on("text:changed", function (e) {
    //   //this will only work using the dev build

    //   console.log(e.target.text);
    //   inputText = e.target.text;
    // });

    cursorClick();
  };

  const deleteModal = () => {
    Swal.fire({
      target: document.getElementById("toast-container"),
      title: "정말 삭제하시겠습니까?",
      html: `<p>해당 이미지의 모든 필기가 삭제됩니다.</p><p>삭제된 필기는 복구할 수 없습니다.</p>`,
      icon: "warning",
      position: "center",
      heightAuto: false,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCanvas();
      }
    });
  };

  const clearCanvas = () => {
    markupCanvasRef.current.getObjects().forEach((o) => {
      if (o !== markupCanvasRef.current.backgroundImage) {
        markupCanvasRef.current.remove(o);
      }
    });
  };

  const modifiedImageUrl = () => {
    let url = markupCanvasRef.current.toDataURL();
    return url;
  };

  return (
    <div>
      {markupModalOpen ? (
        <div className={styles[`modal`]} id="modal">
          <div>
            <div className={styles[`markup-container`]} id="markupContainer">
              <div className={styles[`markup-tool-container`]}>
                <div className={styles[`markup-type-container`]}>
                  <div className={`btn-group`} role="group">
                    <button type="button" className={`btn btn-light ` + (cursorState === "cursor" ? "active" : "")}>
                      <img className={styles[`markup-type-image`]} onClick={cursorClick} alt={"slid cursor icon"} src={"../../../design/assets/slid_cursor_icon.png"} />
                    </button>
                    <button type="button" className={`btn btn-light ` + (cursorState === "pen" ? "active" : "")}>
                      <img className={styles[`markup-type-image`]} onClick={penClick} alt={"slid pen icon"} src={"../../../design/assets/slid_pen_icon.png"} />
                    </button>
                    <button type="button" className={`btn btn-light ` + (cursorState === "highlighter" ? "active" : "")} onClick={highlightingClick}>
                      <img className={styles[`markup-type-image`]} onClick={highlightingClick} alt={"slid highlighter icon"} src={"../../../design/assets/slid_highlighter_icon.png"} />
                    </button>
                    <button type="button" className={`btn btn-light`} onClick={textBtnClick}>
                      <img className={styles[`markup-type-image`]} alt={"slid text icon"} src={"../../../design/assets/slid_text_icon.png"} />
                    </button>
                  </div>
                </div>
                |
                <div className={styles[`color-picker-container`]}>
                  <div className={`btn-group`} role="group">
                    <CircleExample
                      highlightColorPicker={highlightColorPicker}
                      displayColorPicker={displayColorPicker}
                      setDisplayColorPicker={setDisplayColorPicker}
                      color={color}
                      setColor={setColor}
                    />
                  </div>
                </div>
                |
                <div className={styles[`size-picker-container`]}>
                  <div className={`btn-group`} role="group">
                    <button
                      type="button"
                      onClick={() => {
                        setPenWidth(3);
                        setPenWidthState("small");
                      }}
                      className={(penWidthState === "small" ? "active" : "") + ` btn btn-light`}
                    >
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "#000000",
                        }}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPenWidth(6);
                        setPenWidthState("medium");
                      }}
                      className={`btn btn-light ` + (penWidthState === "medium" ? "active" : "")}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: "#000000",
                        }}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPenWidth(9);
                        setPenWidthState("large");
                      }}
                      className={`btn btn-light ` + (penWidthState === "large" ? "active" : "")}
                    >
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: "#000000",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles[`canvas-container`]} id={"canvasContainer"} ref={canvasContainerRef}>
                <canvas id="markup-canvas" className={styles[`markup-canvas`]} ref={markupCanvasRef}></canvas>
              </div>
              <div className={styles[`markup-control-container`]}>
                <div className={styles[`history-container`]}>
                  <button type="button" className={`${styles[`markup-control-btn`]} btn btn-light`} onClick={undo}>
                    <img className={`markup-type-img`} alt={"backward button"} src={"../../../design/assets/slid_backward_icon.png"} />
                  </button>
                  <button type="button" className={`${styles[`markup-control-btn`]} btn btn-light`} onClick={redo}>
                    <img className={`markup-type-img`} alt={"forward button"} src={"../../../design/assets/slid_forward_icon.png"} />
                  </button>
                  <button type="button" onClick={deleteModal} className={`${styles[`markup-control-btn`]} btn btn-light`}>
                    <img className={`markup-type-img`} alt={"reset button"} src={"../../../design/assets/slid_trash_icon.png"} />
                  </button>
                </div>
                <div className={styles[`close-container`]}>
                  <button
                    type="button"
                    className={`${styles[`markup-save-btn`]} btn btn-primary`}
                    onClick={() => {
                      handleSaveMarkupImage(modifiedImageUrl());
                    }}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MarkupModal;
