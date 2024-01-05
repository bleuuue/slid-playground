import React, { useCallback, useState } from "react";
import styles from "./editorSetting.module.css";

const FONT_SIZE_OPTIONS = [
  { key: "Small", value: "small" },
  { key: "Medium", value: "medium" },
  { key: "Large", value: "large" },
];

const AUTO_FORMAT_ACTIVE_OPTIONS = [
  { key: "On", value: "true" },
  { key: "Off", value: "false" },
];

const EditorSetting = (props) => {
  const [fontOptionValue, setFontOptionValue] = useState(props.fontSize);
  const [isAutoFormatActive, setAutoFormatActive] = useState(props.isAutoFormatActive);
  const changeFontSize = useCallback(
    (e) => {
      const value = e.target.value;
      props.setFontSize(value);
      setFontOptionValue(e.target.value);
    },
    [fontOptionValue]
  );

  const changeAutoFormatActive = useCallback(
    (e) => {
      const value = e.target.value;
      props.setAutoFormatActive(value);
      setAutoFormatActive(e.target.value);
    },
    [isAutoFormatActive]
  );

  return (
    <div className={`${styles[`editor-setting-container`]}`}>
      <span className={`${styles[`editor-setting-container-title`]}`}>에디터 설정</span>
      <div className={`${styles[`editor-setting-container-item`]}`}>
        <span>폰트 크기</span>
        <select className={`${styles[`editor-setting-select`]} custom-select custom-select-sm`} onChange={changeFontSize} value={fontOptionValue}>
          {FONT_SIZE_OPTIONS.map((fontOption) => {
            return (
              <option key={fontOption.key} value={fontOption.value}>
                {fontOption.key}
              </option>
            );
          })}
        </select>
      </div>
      <div className={`${styles[`editor-setting-container-item`]}`}>
        <span>자동 형식 변환</span>
        <select className={`${styles[`editor-setting-select`]} custom-select custom-select-sm`} onChange={changeAutoFormatActive} value={isAutoFormatActive}>
          {AUTO_FORMAT_ACTIVE_OPTIONS.map((autoFormatActive) => {
            return (
              <option key={autoFormatActive.key} value={autoFormatActive.value}>
                {autoFormatActive.key}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default EditorSetting;
