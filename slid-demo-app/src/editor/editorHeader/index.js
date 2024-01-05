import React from "react";
import styles from "./editorHeader.module.css";
import slidLogoImg from "../../design/assets/slid_logo_with_text.png";
const EditorHeader = () => {
  const slidDownloadURL = "https://chrome.google.com/webstore/detail/video-screenshot-note-tak/cgajiilhmpfemmdihjnodpibaffakjhj";
  const slidURL = "https://slid.cc/"
  return (
    <div className={`${styles[`editor-header-container`]}`}>
      <a href={slidURL}>
        <img className={`${styles[`editor-header-slid-logo-icon`]}`} src={slidLogoImg} alt="slidLogoImage" />
      </a>
      <span>
        <a className={`${styles[`editor-header-link`]}`} href={slidDownloadURL} target="_blank">
          슬리드 설치하러 가기{" "}
        </a>
        🙏
      </span>
    </div>
  );
};

export default EditorHeader;
