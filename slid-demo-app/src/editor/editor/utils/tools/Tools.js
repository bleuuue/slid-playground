import Header from "./blocks/header/index";
import Paragraph from "./blocks/paragraph/index";
import CheckList from "@editorjs/checklist";
import CodeTool from "./blocks/code/index";
import Marker from "./marker/index";
import NestedList from "./blocks/nestedList/index";
import Underline from "./underline/index";
import SimpleImage from "./blocks/simpleImage/index";
import InlineCode from "./inlineCode/index";
import Video from "./blocks/simpleVideo/index";
import VideoLoader from "./blocks/videoLoader/index";
import ColorPlugin from "editorjs-text-color-plugin";
import LaTeXTool from "./blocks/latex/index";

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+H",
    config: {
      placeholder: "Enter a header",
      levels: [2, 3, 4],
      defaultLevel: 4,
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: {
      preserveBlank: true,
    },
  },
  checkList: {
    class: CheckList,
    inlineToolbar: true,
  },
  codeTool: {
    class: CodeTool,
    shortcut: "CMD+SHIFT+C",
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  nestedList: {
    class: NestedList,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+L",
  },
  image: {
    class: SimpleImage,
  },
  underline: {
    class: Underline,
    shortcut: "CMD+SHIFT+U",
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+E",
  },
  video: {
    class: Video,
  },
  videoLoader: {
    class: VideoLoader,
  },
  math: {
    class: LaTeXTool,
  },
  color: {
    class: ColorPlugin,
    config: {
      colorCollections: [
        "#FF1300",
        "#EC7878",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#0070FF",
        "#03A9F4",
        "#00BCD4",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFE500",
        "#FFBF00",
        "#FF9800",
        "#795548",
        "#9E9E9E",
        "#5A5A5A",
        "#212529",
      ],
      defaultColor: "#000000",
      type: "text",
    },
  },
};
