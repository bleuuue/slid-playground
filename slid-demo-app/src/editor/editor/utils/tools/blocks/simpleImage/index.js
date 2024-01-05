/**
 * Build styles
 */
import "./index.css";
/**
 * SimpleImage Tool for the Editor.js
 * Works only with pasted image URLs and requires no server-side uploader.
 *
 * @typedef {object} SimpleImageData
 * @description Tool's input and output data format
 * @description Tool's input and output data format
 * @property {string} url — image URL
 * @property {float} timestamp — image caption
 * @property {string} caption — image caption
 * @property {boolean} markup - should image be rendered with border
 * @property {boolean} play - should image be rendered with background
 * @property {boolean} ocr - should image be ocr to full width of container
 */

export default class SimpleImage {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: SimpleImageData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly, block }) {
    /**
     * Editor.js API
     */
    // this.data = data;
    this.config = config;
    this.api = api;
    this.readOnly = readOnly;
    this.block = block;
    
    /**
     * When block is only constructing,
     * current block points to previous block.
     * So real block index will be +1 after rendering
     *
     * @todo place it at the `rendered` event hook to get real block index without +1;
     * @type {number}
     */
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;
    /**
     * Styles
     */
    this.CSS = {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,

      /**
       * Tool's classes
       */
      wrapper: "cdx-simple-image",
      imageHolder: "cdx-simple-image__picture",
    };

    /**
     * Nodes cache
     */
    this.nodes = {
      wrapper: null,
      imageHolder: null,
      image: null,
    };

    /**
     * Tool's initial data
     */
    this.data = {
      url: data.url || "",
      timestamp: data.timestamp !== undefined ? data.timestamp : false,
      markup: data.markup !== undefined ? data.markup : false,
      play: data.play !== undefined ? data.play : false,
      ocr: data.ocr !== undefined ? data.ocr : false,
    };

    /**
     * Available Image settings
     */
    this.settings = [
      {
        name: "markup",
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.68333 17.1492C3.44956 17.1488 3.22672 17.0502 3.06916 16.8775C2.9087 16.7062 2.82896 16.4746 2.84999 16.2408L3.05416 13.9958L12.4858 4.5675L15.4333 7.51417L6.00416 16.9417L3.75916 17.1458C3.73333 17.1483 3.70749 17.1492 3.68333 17.1492ZM16.0217 6.925L13.075 3.97834L14.8425 2.21084C14.9988 2.05436 15.2109 1.96643 15.4321 1.96643C15.6533 1.96643 15.8654 2.05436 16.0217 2.21084L17.7892 3.97834C17.9456 4.13464 18.0336 4.34675 18.0336 4.56792C18.0336 4.78909 17.9456 5.0012 17.7892 5.1575L16.0225 6.92417L16.0217 6.925Z" fill="#2E3A59"/>
              </svg>`,
        title: this.config.lang === "ko-KR" ? "펜 필기" : "Annotate",
        click: () => {
          this.config.onClickMarkup(this.data.url, this.blockIndex, this.block.id);
        },
      },
      {
        name: "ocr",
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18.3333H5.00004C4.07957 18.3333 3.33337 17.5871 3.33337 16.6666V3.3333C3.33337 2.41283 4.07957 1.66663 5.00004 1.66663H10.8334C11.0545 1.66585 11.2668 1.75381 11.4225 1.9108L16.4225 6.9108C16.5795 7.06658 16.6675 7.27881 16.6667 7.49996V16.6666C16.6667 17.5871 15.9205 18.3333 15 18.3333ZM5.00004 3.3333V16.6666H13.8217L11.6834 14.5283C11.1752 14.8347 10.5935 14.9977 10 15C8.46771 15.0166 7.11712 13.9972 6.71292 12.5191C6.30872 11.0409 6.95269 9.47615 8.28025 8.7107C9.6078 7.94525 11.2846 8.17185 12.3614 9.2622C13.4382 10.3526 13.6437 12.0321 12.8617 13.35L15 15.49V7.84497L10.4884 3.3333H5.00004ZM10 9.99997C9.07957 9.99997 8.33337 10.7462 8.33337 11.6666C8.33337 12.5871 9.07957 13.3333 10 13.3333C10.9205 13.3333 11.6667 12.5871 11.6667 11.6666C11.6667 10.7462 10.9205 9.99997 10 9.99997Z" fill="#2E3A59"/>
              </svg> `,
        title: this.config.lang === "ko-KR" ? "텍스트 추출" : "Grab text",
      },
      {
        name: "play",
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.99996 18.3333C5.39968 18.3283 1.67168 14.6003 1.66663 9.99997V9.83331C1.75824 5.25375 5.52878 1.6066 10.1089 1.66737C14.6889 1.72814 18.3614 5.47405 18.3314 10.0544C18.3015 14.6348 14.5804 18.3324 9.99996 18.3333ZM8.33329 6.24997V13.75L13.3333 9.99997L8.33329 6.24997Z" fill="#2E3A59"/>
              </svg>`,
        title: this.config.lang === "ko-KR" ? "여기부터 재생" : "Play here",
        click: () => {
          this.config.onClickPlayVideoFromTs(this.data.timestamp);
        },
      },
    ];
  }

  /**
   * Creates a Block:
   *  1) Show preloader
   *  2) Start to load an image
   *  3) After loading, append image and caption input
   *
   * @public
   */

  render() {
    const wrapper = this._make("div", [this.CSS.baseClass, this.CSS.wrapper]),
      loader = this._make("div", this.CSS.loading),
      imageHolder = this._make("div", this.CSS.imageHolder),
      image = this._make("img");

    image.setAttribute("blockType", "image");
    wrapper.draggable = true;
    image.draggable = true;
    image.contentEditable = false;
    wrapper.appendChild(loader);

    console.log("rendering");

    if (this.data.url) {
      image.src = this.data.url;
    }

    image.onload = () => {
      wrapper.classList.remove(this.CSS.loading);
      imageHolder.appendChild(image);
      wrapper.appendChild(imageHolder);
      loader.remove();
      this._acceptTuneView();
    };

    image.contentEditable = false;

    image.onerror = (e) => {
      // @todo use api.Notifies.show() to show error notification
      console.log("Failed to load an image", e);
    };

    this.nodes.imageHolder = imageHolder;
    this.nodes.wrapper = wrapper;
    this.nodes.image = image;

    return wrapper;
  }

  moved(event) {
    // const currentScrollTop = document.getElementById("editor-container").scrollTop;
    // if (event.detail.fromIndex < event.detail.toIndex) {
    //   document.getElementById("editor-container").scrollTop = currentScrollTop + 100;
    // } else {
    //   document.getElementById("editor-container").scrollTop = currentScrollTop - 100;
    // }
  }

  /**
   * @public
   * @param {Element} blockContent - Tool's wrapper
   * @returns {SimpleImageData}
   */
  save(blockContent) {
    const image = blockContent.querySelector("img");

    if (!image) {
      return this.data;
    }

    return this.data;
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      url: {},
      timestamp: {},
      markup: {},
      play: {},
      ocr: {},
    };
  }

  /**
   * Notify core that read-only mode is suppoorted
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Read pasted image and convert it to base64
   *
   * @static
   * @param {File} file
   * @returns {Promise<SimpleImageData>}
   */
  onDropHandler(file) {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onload = (event) => {
        resolve({
          url: event.target.result,
        });
      };
    });
  }

  /**
   * Returns image data
   *
   * @returns {SimpleImageData}
   */
  get data() {
    return this._data;
  }

  /**
   * Set image data and update the view
   *
   * @param {SimpleImageData} data
   */
  set data(data) {
    this._data = Object.assign({}, this.data, data);

    if (this.nodes.image) {
      this.nodes.image.src = this.data.url;
    }
  }

  /**
   * Specify paste substitutes
   *
   * @see {@link ../../../docs/tools.md#paste-handling}
   * @public
   */
  static get pasteConfig() {
    return {
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|webp)$/i,
      },
      tags: ["img"],
      files: {
        mimeTypes: ["image/*"],
      },
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = document.createElement("div");

    this.settings.forEach((tune) => {
      const el = document.createElement("div");

      el.classList.add(this.CSS.settingsButton);
      el.innerHTML = tune.icon;

      if (tune.title) {
        this.api.tooltip.onHover(el, tune.title, {
          placement: "top",
        });
      }

      el.addEventListener("click", () => {
        this._toggleTune(tune.name);
        tune.click();
        //el.classList.toggle(this.CSS.settingsButtonActive);
      });

      el.classList.toggle(this.CSS.settingsButtonActive, this.data[tune.name]);

      wrapper.appendChild(el);
    });

    return wrapper;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Click on the Settings Button
   *
   * @private
   * @param tune
   */
  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }

  /**
   * Add specified class corresponds with activated tunes
   *
   * @private
   */
  _acceptTuneView() {
    this.settings.forEach((tune) => {
      this.nodes.imageHolder.classList.toggle(this.CSS.imageHolder + "--" + tune.name.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`), !!this.data[tune.name]);

      if (tune.name === "ocr") {
        this.api.blocks.stretchBlock(this.blockIndex, !!this.data.ocr);
      }
    });
  }
}
