import React from "react";
import styles from "./editorDownload.module.css";
import pdfFileImg from "../../design/assets/slid_download_pdf_icon.png";
import wordFileImg from "../../design/assets/slid_download_word_icon.png";
import pngFileImg from "../../design/assets/slid_download_png_icon.png";
import markdownFileImg from "../../design/assets/slid_download_markdown_icon.png";
import { useReactToPrint } from "react-to-print";
import { exportToWord, exportToImage, exportToMarkdown } from "../editor/utils/download";
import Swal from "sweetalert2";

const EditorDownload = (props) => {
  const { componentRef, currentContent, docTitle } = props;

  const renderPdfPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className={`${styles[`editor-download-container`]}`}>
      <span className={`${styles[`editor-download-container-title`]}`}>다운로드 옵션</span>
      <a className={`${styles[`editor-download-container-item`]}`} href="#" onClick={renderPdfPrint}>
        <img src={pdfFileImg} className={`${styles[`editor-download-type-icon`]}`} />
        PDF
      </a>
      <a
        className={`${styles[`editor-download-container-item`]}`}
        href="#"
        onClick={() => {
          currentContent
            .save()
            .then((outputData) => {
              exportToWord({ currentContent: outputData, title: docTitle });
            })
            .catch((error) => {
              console.log("Saving failed: ", error);
            });
        }}
      >
        <img src={wordFileImg} className={`${styles[`editor-download-type-icon`]}`} />
        Word
      </a>
      <a
        className={`${styles[`editor-download-container-item`]}`}
        href="#"
        onClick={() => {
          currentContent
            .save()
            .then((outputData) => {
              if (outputData.blocks.find(({ type }) => type === "image")) {
                exportToImage({ currentContent: outputData, title: docTitle });
              } else {
                Swal.fire({
                  target: document.getElementById("toast-container"),
                  title: "문서가 비어있습니다!",
                  html: `<p>비어있는 문서는 이미지로 다운로드 받을 수 없습니다. <br /> 영상을 캡쳐해주세요.</p>`,
                  position: "center",
                  confirmButtonText: "닫기",
                  icon: "info",
                  confirmButtonColor: "#2778c4",
                  heightAuto: false,
                }).then(() => {});
              }
            })
            .catch((error) => {
              console.log("Saving failed: ", error);
            });
        }}
      >
        <img src={pngFileImg} className={`${styles[`editor-download-type-icon`]}`} />
        Images
      </a>
      <a
        className={`${styles[`editor-download-container-item`]}`}
        href="#"
        onClick={() => {
          currentContent
            .save()
            .then((outputData) => {
              exportToMarkdown({ currentContent: outputData, title: docTitle });
            })
            .catch((error) => {
              console.log("Saving failed: ", error);
            });
        }}
      >
        <img src={markdownFileImg} className={`${styles[`editor-download-type-icon`]}`} />
        Markdown
      </a>
    </div>
  );
};

export default EditorDownload;
