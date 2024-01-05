import "./index.css";

class VideoLoader {
  constructor({ data, config, api, readOnly = false }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = data;
    this.config = config;

    this.countdownNumber = 1;

    this.blockIndex = this.api.blocks.getCurrentBlockIndex();
  }

  render() {
    const loader = document.createElement("div");
    loader.contentEditable = false;

    const loaderPlaceHolder = document.createElement("div");
    loaderPlaceHolder.setAttribute("blocktype", "loader");
    loaderPlaceHolder.className = "loader-placeholder";

    const loaderHeader = document.createElement("div");
    loaderHeader.className = "loader-header";
    const loaderRedDotIcon = document.createElement("img");
    loaderRedDotIcon.src = "../../../../../../../design/assets/slid_recording_loader_red_icon.png";
    const loaderHeaderText = document.createElement("span");
    loaderHeaderText.innerText = " Recording..";
    loaderHeader.append(loaderRedDotIcon, loaderHeaderText);

    const loaderBody = document.createElement("div");
    loaderBody.className = "loader-body";
    const loaderCountdownText = document.createElement("span");
    this.countdownNumber = 0;
    loaderCountdownText.innerText = `${this.countdownNumber} sec`;
    loaderBody.append(loaderCountdownText);

    loaderPlaceHolder.append(loaderHeader, loaderBody);
    loader.append(loaderPlaceHolder);

    const countdownId = setInterval(() => {
      this.countdownNumber = this.countdownNumber + 1;
      loaderCountdownText.innerText = `${this.countdownNumber} sec`;
      if (this.countdownNumber === this.data.clipRecordingMaxCountdownNumber - 5) loaderCountdownText.className = "countdown-red";
      if (this.countdownNumber === this.data.clipRecordingMaxCountdownNumber) clearInterval(countdownId);
    }, 1000);

    // loader.addEventListener("click", () => {
    //   this.config.onClickLoader();
    // });

    return loader;
  }

  save() {
    return this.data;
  }

  static get isReadOnlySupported() {
    return true;
  }
}

export default VideoLoader;
