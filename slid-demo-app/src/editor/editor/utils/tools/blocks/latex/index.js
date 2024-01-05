/*
              EditorJS LaTeX
      Created By: MD Gaziur Rahman Noor
    Adds LaTex block support to EditorJS
*/
import "./index.css";

export default class LaTeXTool {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, readOnly }) {
    //Get the saved data if exists
    this.data = data.math;
    this.readOnly = readOnly;
  }

  static get toolbox() {
    return {
      title: "Math",
      //icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
      icon: `<svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0H12.9999V3.149H10.6948V2.28116H4.93783L8.66165 6.68056L4.93783 11.0799H10.6948V10.2121H13V13.3611H0L5.65462 6.68056L0 0Z"/>
      </svg>`,
    };
  }

  render() {
    //Create all the DOM elements
    const wrapper = document.createElement("div");
    const preview = document.createElement("p");
    const input = document.createElement("input");

    if (typeof window.katex === "undefined") {
      let errorMessageSpan = document.createElement("span");
      errorMessageSpan.className = "errorMessage";
      errorMessageSpan.innerText = "[Erorr] KaTeX is not found! Add KaTeX to this webpage to continue!";
      return errorMessageSpan;
    }

    wrapper.classList.add("math-input-wrapper");
    preview.contentEditable = false;
    preview.classList.add("math-preview");
    preview.draggable = true;
    preview.ondragstart = (event) => {
      event.dataTransfer.setData("text/plain", "");
    };

    input.classList.add("math-input");

    if (!this.readOnly) {
      preview.addEventListener(
        "click",
        () => {
          if (input.classList.contains("math-input-hide")) {
            input.classList.remove("math-input-hide");
            input.focus();
          }
        },
        { once: true }
      );

      input.addEventListener("focusout", (e) => {
        if (!input.classList.contains("math-input-hide")) {
          input.classList.add("math-input-hide");
          setTimeout(() => {
            preview.addEventListener(
              "click",
              () => {
                if (input.classList.contains("math-input-hide")) {
                  input.classList.remove("math-input-hide");
                  input.focus();
                }
              },
              { once: true }
            );
          }, 300);
        }
      });
    }

    //Load the data if exists
    input.value = this.data ? this.data : "";

    // hide input when data exists
    if (this.data) {
      input.classList.add("math-input-hide");
    }

    //Set the placeholder text for LaTeX expression input
    input.setAttribute("placeholder", "Enter LaTeX here");

    //Will render LaTeX if there is any in saved data
    window.katex.render(input.value, preview, {
      throwOnError: false,
    });

    input.addEventListener("keyup", (e) => {
      //Prevent default actions
      e.preventDefault();

      //Render LaTeX expression
      window.katex.render(input.value, preview, {
        throwOnError: false,
      });
    });

    wrapper.appendChild(preview);
    wrapper.appendChild(input);

    return wrapper;
  }

  save(blockContent) {
    return {
      math: blockContent.childNodes[1].value,
    };
  }
}
