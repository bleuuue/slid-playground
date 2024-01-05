/**
 * Build styles
 */
import "./index.css";

/**
 * Underline Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
export default class Underline {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {
    return "cdx-underline";
  }

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({ api }) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = "U";

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @returns {HTMLElement}
   */
  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    const termWrapper = this.api.selection.findParentTag(this.tag, Underline.CSS);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    const u = document.createElement(this.tag);

    u.classList.add(Underline.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    u.appendChild(range.extractContents());
    range.insertNode(u);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(u);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    const sel = window.getSelection();
    const range = sel.getRangeAt(0);

    const unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, Underline.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Get Tool icon's SVG
   *
   * @returns {string}
   */
  get toolboxIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 8 13" width="8" height="13"><path d="M5.48 7.34v-.27c-.25.32-.51.58-.79.8a2.9 2.9 0 01-.9.48c-.32.1-.7.15-1.11.15-.5 0-.96-.1-1.36-.31a2.3 2.3 0 01-.93-.87A3.85 3.85 0 010 5.4V1.25C0 .83.1.52.28.31.48.11.72 0 1.03 0a1 1 0 01.77.31c.2.21.29.53.29.94v3.36c0 .48.04.89.12 1.22.08.33.23.59.44.77.21.2.5.29.86.29.35 0 .68-.11 1-.32.3-.2.53-.48.67-.82.12-.3.18-.95.18-1.95V1.25c0-.41.1-.73.3-.94.18-.2.44-.31.75-.31.3 0 .56.1.75.31.19.2.28.52.28.94v6.07c0 .4-.09.7-.27.9a.9.9 0 01-.7.3.9.9 0 01-.7-.31c-.2-.2-.29-.5-.29-.87zM.72 9.68h6.36a.72.72 0 010 1.44H.72a.72.72 0 010-1.44z"/></svg>`;
  }

  /**
   * Sanitizer rule
   *
   * @returns {{u: {class: string}}}
   */
  static get sanitize() {
    return {
      u: {
        class: Underline.CSS,
      },
    };
  }
}
