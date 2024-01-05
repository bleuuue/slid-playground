import "./index.css";

/**
 * @typedef {object} ParagraphConfig
 * @property {string} placeholder - placeholder for the empty paragraph
 * @property {boolean} preserveBlank - Whether or not to keep blank paragraphs when saving editor data
 */

/**
 * @typedef {Object} ParagraphData
 * @description Tool's input and output data format
 * @property {String} text — Paragraph's content. Can include HTML tags: <a><b><i>
 */
class Paragraph {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @return {string}
   * @constructor
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {ParagraphData} params.data - previously saved data
   * @param {ParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.config = config;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph",
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
      this.onInput = this.onInput.bind(this);
    }

    /**
     * Placeholder for paragraph if it is first Block
     * @type {string}
     */
    this._placeholder = config.placeholder ? config.placeholder : Paragraph.DEFAULT_PLACEHOLDER;
    this._data = {};
    this._element = this.drawView();
    this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;

    this.data = data;
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    if (e.code !== "Backspace" && e.code !== "Delete") {
      return;
    }

    const { textContent } = this._element;

    if (textContent === "") {
      this._element.innerHTML = "";
    }
  }

  // auto format by markdown syntax
  onInput(e) {
    const checkedAutoFormat = this.config.checkIsAutoFormatActive() === "false" ? false : true;

    if (!checkedAutoFormat) {
      return;
    }

    const { textContent } = this._element;

    if (textContent === "```") {
      this.convertBlock(this.api.blocks.getCurrentBlockIndex(), "codeTool", {});
    } else if (textContent === "- ") {
      this.convertBlock(this.api.blocks.getCurrentBlockIndex(), "nestedList", { style: "unordered" });
    } else if (textContent === "1. ") {
      this.convertBlock(this.api.blocks.getCurrentBlockIndex(), "nestedList", { style: "ordered" });
    } else if (textContent === "# ") {
      this.convertBlock(this.api.blocks.getCurrentBlockIndex(), "header", { level: 2 });
    } else if (textContent === "## ") {
      this.convertBlock(this.api.blocks.getCurrentBlockIndex(), "header", { level: 3 });
    } else if (textContent === "### ") {
      this.convertBlock(this.api.blocks.getCurrentBlockIndex(), "header", { level: 4 });
    } else if (textContent === "[]") {
      this.convertBlock(this.api.blocks.getCurrentBlockIndex(), "checkList", {});
    }
  }

  // convert block
  convertBlock(blockIndex, blockType, value) {
    this.api.blocks.delete(blockIndex);
    this.api.blocks.insert(blockType, value, {}, blockIndex, true);
    this.api.caret.setToBlock(blockIndex);
  }

  /**
   * @return void
   * @param {KeyboardEvent} e - on Backspace Key Pressed
   */
  onBackspacePressed(e, div) {
    const isPrevTextSpaceOrTab =
      // space
      this.getTextFromHeadToCaret(div).includes(" ") ||
      // tab
      this.getTextFromHeadToCaret(div).includes("	");

    if (isPrevTextSpaceOrTab) {
      e.stopPropagation();
    }
  }

  /**
   * @return void
   * @param {KeyboardEvent} e - on Tab Key Pressed
   */
  onTabPressed(e) {
    /**
     * Prevent editor.js behaviour
     */
    e.stopPropagation();

    /**
     * Prevent browser tab behaviour
     */
    e.preventDefault();

    /**
     * Insert `Tab`
     */
    document.execCommand("insertHTML", false, "&#009");
  }

  /**
   * @return void
   * @param {KeyboardEvent} e - on Tab Key Pressed
   */
  onShiftTabPressed(e, div) {
    /**
     * Prevent editor.js behaviour
     */
    e.stopPropagation();

    /**
     * Prevent browser tab behaviour
     */
    e.preventDefault();

    /**
     * Do unshift for remove Tab
     */
    this.unshift(div);
  }

  unshift(div) {
    const getCaretCharOffset = (element) => {
      var caretOffset = 0;

      if (window.getSelection) {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      } else if (document.selection && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }

      return caretOffset;
    };

    if (!this.data) return;
    // Get the block's content and Check is Tab or not.
    const firstSpaceOfParagraph = this.data["text"][0];
    const isFirstSpaceTab = /\t/gi.test(firstSpaceOfParagraph);
    const currentData = this.data["text"];
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const currentCaretOffset = getCaretCharOffset(div);
    const inFrontOfCurrentCaret = this.data["text"][currentCaretOffset - 1];
    const isInFrontOfCurrentCaretTab = /\t/gi.test(inFrontOfCurrentCaret);

    /**
     * Delete if the first space of paragraph is Tab.
     * else, check in front of current caret position is Tab and Delete.
     */
    if (isFirstSpaceTab) {
      // Delete Tab and replace
      const slicedData = currentData.substring(1, currentData.length);
      this.api.blocks.delete(currentBlockIndex);
      this.api.blocks.insert(
        "paragraph",
        {
          text: slicedData,
        },
        {},
        undefined,
        false
      );
      this.api.caret.setToBlock(currentBlockIndex, "default", currentCaretOffset - 1);
    } else if (isInFrontOfCurrentCaretTab) {
      const preSlicedData = currentData.substring(0, currentCaretOffset - 1);
      const postSlicedData = currentData.substring(currentCaretOffset, currentData.length);
      const slicedData = preSlicedData.concat(postSlicedData);
      this.api.blocks.delete(currentBlockIndex);
      this.api.blocks.insert(
        "paragraph",
        {
          text: slicedData,
        },
        {},
        undefined,
        false
      );
      this.api.caret.setToBlock(currentBlockIndex, "default", currentCaretOffset - 1);
    }
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let div = document.createElement("DIV");

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = false;
    div.spellcheck = false;
    div.dataset.placeholder = this.api.i18n.t(this._placeholder);

    if (!this.readOnly) {
      div.contentEditable = true;
      div.addEventListener("keyup", this.onKeyUp);
      div.addEventListener("input", this.onInput, false);
      div.addEventListener("keydown", (event) => {
        switch (event.key) {
          // When text from head to caret is space or tab, EditorJS merges this block with previous block.
          // So stop event bubbling by event.stopPropagation(); when it's space or tab
          case "Backspace":
            this.onBackspacePressed(event, div);
            break;
          case "Tab":
            if (event.shiftKey) {
              this.onShiftTabPressed(event, div);
            } else {
              this.onTabPressed(event);
            }
            break;
          default:
            return;
        }
      });
    }

    return div;
  }

  getTextFromHeadToCaret(element) {
    var caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
      var range = window.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
      var textRange = document.selection.createRange();
      var preCaretTextRange = document.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    var divStr = element.innerText;
    return divStr.substring(0, caretOffset);
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._element;
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   * @param {ParagraphData} data
   * @public
   */
  merge(data) {
    let newData = {
      text: this.data.text + data.text,
    };

    this.data = newData;
  }

  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    if (savedData.text.trim() === "" && !this._preserveBlank) {
      return false;
    }

    return true;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: toolsContent.innerHTML,
    };
  }

  moved(event) {
    const currentScrollTop = document.getElementById("editor-container").scrollTop;
    const changedHeight = this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex()).holder.offsetHeight;
    if (event.detail.fromIndex < event.detail.toIndex) {
      document.getElementById("editor-container").scrollTop = currentScrollTop + changedHeight;
    } else {
      document.getElementById("editor-container").scrollTop = currentScrollTop - changedHeight;
    }
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML,
    };

    this.data = data;
  }

  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: "text", // to convert Paragraph to other block, use 'text' property of saved data
      import: "text", // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      },
    };
  }

  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get current Tools`s data
   * @returns {ParagraphData} Current data
   * @private
   */
  get data() {
    let text = this._element.innerHTML;

    this._data.text = text;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {ParagraphData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    this._element.innerHTML = this._data.text || "";
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["P"],
    };
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 -0.3 9 11.4" width="12" height="14">
            <path d="M0 2.77V.92A1 1 0 01.2.28C.35.1.56 0 .83 0h7.66c.28.01.48.1.63.28.14.17.21.38.21.64v1.85c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26a1 1 0 01-.21-.66V1.69H5.6v7.58h.5c.25 0 .45.08.6.23.17.16.25.35.25.6s-.08.45-.24.6a.87.87 0 01-.62.22H3.21a.87.87 0 01-.61-.22.78.78 0 01-.24-.6c0-.25.08-.44.24-.6a.85.85 0 01.61-.23h.5V1.7H1.73v1.08c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26A1 1 0 010 2.77z"/>
        </svg>
      `,
      title: "Paragraph",
    };
  }
}

export default Paragraph;
