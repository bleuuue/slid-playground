import "./VideoDocumentEditor.css";
import React from "react";
import EditorComponent from "../editor/EditorComponent";

const VideoDocumentEditor = (props) => {
  const { selectAreaCoordinate, captureImgData, isCapturingOneClick, setSelectAreaCoordinate, setShowSelectAreaCanvas, setCaptureImgData, setIsCapturingOneClick, setCaptureSelectArea, isMacOs, lang } =
    props;

  return (
    <div id="toast-container">
      <EditorComponent
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

export default VideoDocumentEditor;
