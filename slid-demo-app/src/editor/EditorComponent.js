import React from "react";
import Editor from "./editor";
import styles from "./editorComponent.module.css";
import "./print.css";
import { withResizeDetector } from "react-resize-detector";

const EditorAdaptiveWithDetector = withResizeDetector(Editor);

const EditorComponent = (props) => {
  const { selectAreaCoordinate, captureImgData, isCapturingOneClick, setSelectAreaCoordinate, setShowSelectAreaCanvas, setCaptureSelectArea, setCaptureImgData, setIsCapturingOneClick, lang, isMacOs } =
    props;

  return (
    <div id="custom-target" className={`${styles[`container`]}`}>
      <EditorAdaptiveWithDetector
        selectAreaCoordinate={selectAreaCoordinate}
        captureImgData={captureImgData}
        isCapturingOneClick={isCapturingOneClick}
        setSelectAreaCoordinate={setSelectAreaCoordinate}
        setShowSelectAreaCanvas={setShowSelectAreaCanvas}
        setCaptureSelectArea={setCaptureSelectArea}
        setCaptureImgData={setCaptureImgData}
        setIsCapturingOneClick={setIsCapturingOneClick}
        lang={lang}
        isMacOs={isMacOs}
      />
    </div>
  );
};

export default EditorComponent;
