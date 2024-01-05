import React from "react";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./utils/tools/Tools";
import styles from "./editor.module.css";
import EditorController from "../editorController";
import Undo from "./utils/tools/undo";
import Swal from "sweetalert2";
import MarkupModal from "./MarkupModal";
import DragDrop from "./utils/tools/dragDrop";
import EditorHeader from "../editorHeader";

class Editor extends React.PureComponent {
  componentRef = React.createRef();
  editorContainerRef = React.createRef();
  noteSavingTimeoutId = 1;
  ceBlocks = document.getElementsByClassName("ce-block");
  editorContainer = document.querySelector("#editor-container");

  constructor(props) {
    super(props);
    this.state = {
      fontSize: "small",
      isAutoFormatActive: "true",
      lastFocusedBlockIndex: 0,
      isSaving: true,
      docTitle: "",
      markupModalOpen: false,
      markupImgUrl: "",
      markupImgIndex: "",
      markupImgBlockId: null,
      loaderIndex: 0,
    };
  }

  async componentDidMount() {}

  handleSetEditorElementKeyDownListener = () => {
    window.addEventListener("keydown", (event) => {
      if (event.code === "Backspace") {
        this.handleDeleteImageAndVideo();
        return;
      }
    });
  };

  handleAddListener = () => {
    for (let index = 0; index < this.ceBlocks.length; index++) {
      this.ceBlocks[index].addEventListener("focusout", (event) => {
        this.setState({ lastFocusedBlockIndex: index });
      });
    }
  };

  handleDeleteImageAndVideo = () => {
    if (this.editorInstance.blocks.getCurrentBlockIndex() === -1) {
      return;
    }
    const currentBlock = this.editorInstance.blocks.getBlockByIndex(this.editorInstance.blocks.getCurrentBlockIndex());
    if ((currentBlock && currentBlock.name === "image") || currentBlock.name === "video") {
      if (!currentBlock.holder.className.includes("ce-block--focused")) {
        currentBlock.holder.className = "ce-block ce-block--focused";
        return;
      }
      this.editorInstance.blocks.delete(this.editorInstance.blocks.getCurrentBlockIndex());
    }
  };

  handleSetUndoRedoInstance = () => {
    const editor = this.editorInstance;
    this.undoInstance = new Undo({ editor });
  };

  handleSetDragAndDropInstance = () => {
    this.dragAndDropInstance = new DragDrop(this.editorInstance);
  };

  handleChangeEditor = () => {
    if (this.state["isSaving"]) {
      clearTimeout(this.noteSavingTimeoutId);
    }
    this.setState({ isSaving: false });

    this.noteSavingTimeoutId = setTimeout(() => {
      this.setState({ isSaving: true });
    }, 300);

    this.setState({ lastFocusedBlockIndex: this.editorInstance.blocks.getCurrentBlockIndex() === -1 ? this.state["lastFocusedBlockIndex"] : this.editorInstance.blocks.getCurrentBlockIndex() });
  };

  handleInsertImage = () => {
    if (this.editorInstance.blocks.getCurrentBlockIndex() === -1) {
      this.editorInstance.blocks.insert("image", { url: this.props.captureImgData.url, timestamp: this.props.captureImgData.timestamp }, {}, this.state["lastFocusedBlockIndex"], true);
    } else {
      this.editorInstance.blocks.insert("image", { url: this.props.captureImgData.url, timestamp: this.props.captureImgData.timestamp }, {}, this.editorInstance.blocks.getCurrentBlockIndex(), true);
    }
    this.editorInstance.caret.setToNextBlock();
    this.editorContainerRef.current.scrollTop = this.editorContainerRef.current.scrollHeight;
  };

  handleInsertThumbnail = () => {
    let w, h, ratio;
    const thumbnailCanvas = document.createElement("canvas");
    const videos = document.getElementsByTagName("video");
    const video = videos[0];

    ratio = 1280 / 720;
    w = document.getElementById("video-size-check").offsetWidth;
    h = parseInt(w / ratio, 10);

    thumbnailCanvas.width = w;
    thumbnailCanvas.height = h;

    const ctx = thumbnailCanvas.getContext("2d");
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(video, 0, 0, w, h);
    const thumbnailUrl = thumbnailCanvas.toDataURL();

    if (this.editorInstance.blocks.getCurrentBlockIndex() === -1) {
      this.editorInstance.blocks.insert("image", { url: thumbnailUrl }, {}, this.loaderIndex, true);
    } else {
      this.editorInstance.blocks.insert("image", { url: thumbnailUrl }, {}, this.loaderIndex, true);
    }
  };

  handleInsertVideo = (recordVideoUrl) => {
    if (this.editorInstance.blocks.getCurrentBlockIndex() === -1) {
      this.editorInstance.blocks.insert("video", { url: recordVideoUrl }, {}, this.loaderIndex, true);
    } else {
      this.editorInstance.blocks.insert("video", { url: recordVideoUrl }, {}, this.loaderIndex, true);
    }
  };

  handleInsertMarkupImage = (url) => {
    this.editorInstance.blocks.update(this.state.markupImgBlockId, {
      url: url,
    });
  };

  handleInsertVideoLoader = () => {
    if (this.editorInstance.blocks.getCurrentBlockIndex() === -1) {
      this.editorInstance.blocks.insert("videoLoader", {}, {}, this.state["lastFocusedBlockIndex"] + 1, true);
    } else {
      this.editorInstance.blocks.insert("videoLoader", {}, {}, this.editorInstance.blocks.getCurrentBlockIndex() + 1, true);
    }

    this.loaderIndex = this.editorInstance.blocks.getCurrentBlockIndex();
  };

  handleDeleteVideoLoader = () => {
    for (let i = 0; i < this.editorInstance.blocks.getBlocksCount(); i++) {
      const block = this.editorInstance.blocks.getBlockByIndex(i);
      switch (block.name) {
        case "videoLoader":
          this.loaderIndex = i;
          break;
      }
    }
    this.editorInstance.blocks.delete(this.loaderIndex);
  };

  handleCheckEditorBlockCount = () => {
    if (this.editorInstance.blocks.getBlocksCount() === 0) {
      this.editorInstance.blocks.insert(
        "paragraph",
        {
          text: "",
        },
        {},
        this.editorInstance.blocks.getCurrentBlockIndex(),
        true
      );
    }
  };

  handleChangeTitle = (e) => {
    if (e.target.value) {
      this.setState({ docTitle: e.target.value });
      document.title = e.target.value;
    } else {
      document.title = this.props.lang === "ko-KR" ? "제목 없음" : "Untitled";
    }
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (!this.editorInstance || !this.editorInstance.blocks) return;
      this.editorInstance.blocks.insert(
        "paragraph",
        {
          text: "",
        },
        {},
        0,
        true
      );
      this.editorInstance.caret.setToFirstBlock();
    }
  };

  handleSetFontSize = (size) => {
    this.setState({ fontSize: size ? size : "small" });
  };

  handleSaveMarkupImage = (url) => {
    this.setState({ markupModalOpen: false });
    this.handleInsertMarkupImage(url);
  };

  handleMarkupModalClose = () => {
    this.setState({ markupModalOpen: false });
  };

  handleSetAutoFormatActive = (isAutoFormatActive) => {
    this.setState({ isAutoFormatActive: isAutoFormatActive ? isAutoFormatActive : "true" });
  };

  checkIsAutoFormatActive() {
    return this.state["isAutoFormatActive"];
  }

  render() {
    let { fontSize, isSaving, docTitle, captureImgUrl, markupModalOpen, markupImgUrl } = this.state;
    const { width, lang, isMacOs } = this.props;

    this.handleAddListener();

    EDITOR_JS_TOOLS.paragraph.config = {
      checkIsAutoFormatActive: () => {
        return this.checkIsAutoFormatActive();
      },
    };

    EDITOR_JS_TOOLS.image.config = {
      lang: lang,
      url: captureImgUrl,
      onClickPlayVideoFromTs: (timestamp) => {
        const videos = document.getElementsByTagName("video");
        const video = videos[0];
        video.currentTime = timestamp;
      },
      onClickMarkup: (url, markupImgIndex, blockId) => {
        this.setState({ markupModalOpen: true, markupImgUrl: url, markupImgIndex: markupImgIndex, markupImgBlockId: blockId });
      },
    };

    return (
      <div id="editor-container" className={`${styles[`container`]}`}>
        <EditorHeader />
        <div ref={this.editorContainerRef} className={`${styles[`editor-container`]} ${styles[`font-${fontSize}`]}`}>
          <h1 className={`${styles[`font-${fontSize}`]}`}>
            <input
              className={`${styles[`input-title`]}`}
              type="text"
              value={docTitle}
              onChange={this.handleChangeTitle}
              placeholder={lang === "ko-KR" ? "제목을 입력하세요" : "Enter title"}
              autoComplete="false"
              autoFocus={true}
              onKeyPress={this.handleKeyPress}
            />
          </h1>
          <EditorJs
            ref={this.componentRef}
            className={`${styles[`editor-js`]}`}
            tools={EDITOR_JS_TOOLS}
            onReady={() => {
              this.handleSetUndoRedoInstance();
              this.handleSetDragAndDropInstance();
              this.handleSetEditorElementKeyDownListener();
            }}
            onChange={this.handleChangeEditor}
            instanceRef={(instance) => (this.editorInstance = instance)}
          />
          <MarkupModal
            markupModalOpen={markupModalOpen}
            markupImgUrl={markupImgUrl}
            handleInsertMarkupImage={this.handleInsertMarkupImage}
            handleSaveMarkupImage={this.handleSaveMarkupImage}
            handleMarkupModalClose={this.handleMarkupModalClose}
          />
        </div>
        <EditorController
          selectAreaCoordinate={this.props.selectAreaCoordinate}
          captureImgData={this.props.captureImgData}
          isCapturingOneClick={this.props.isCapturingOneClick}
          setSelectAreaCoordinate={this.props.setSelectAreaCoordinate}
          setShowSelectAreaCanvas={this.props.setShowSelectAreaCanvas}
          setCaptureSelectArea={this.props.setCaptureSelectArea}
          setCaptureImgData={this.props.setCaptureImgData}
          handleInsertImage={this.handleInsertImage}
          componentRef={this.componentRef}
          handleSetFontSize={this.handleSetFontSize}
          handleSetAutoFormatActive={this.handleSetAutoFormatActive}
          undoEditor={() => {
            this.undoInstance.undo();
            this.handleCheckEditorBlockCount();
          }}
          redoEditor={() => this.undoInstance.redo()}
          isSaving={isSaving}
          setIsCapturingOneClick={this.props.setIsCapturingOneClick}
          editorWidth={width}
          lang={lang}
          isMacOs={isMacOs}
          currentContent={this.editorInstance}
          docTitle={docTitle}
          handleInsertVideo={this.handleInsertVideo}
          handleInsertVideoLoader={this.handleInsertVideoLoader}
          handleDeleteVideoLoader={this.handleDeleteVideoLoader}
          handleInsertThumbnail={this.handleInsertThumbnail}
        />
      </div>
    );
  }
}

export default Editor;
