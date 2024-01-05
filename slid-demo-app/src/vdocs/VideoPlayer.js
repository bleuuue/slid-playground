import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import VideoCapture from "./VideoCapture";
import styles from "./VideoPlayer.module.css";

const VideoPlayer = (props) => {
  const { selectAreaCoordinate, setSelectAreaCoordinate, setCaptureImgData, showSelectAreaCanvas, isCapturingOneClick, setIsCapturingOneClick, lang, isMacOs, captureImgData } = props;

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoState, setVideoState] = useState("available");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [skipInterval, setSkipInterval] = useState(5);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const videoPlayerRef = useRef();
  const videoPlaceholderRef = useRef();

  useEffect(() => {
    setSelectAreaCoordinate({
      left: 0,
      top: 0,
      width: videoPlaceholderRef.current.offsetWidth - 2,
      height: videoPlaceholderRef.current.offsetHeight - 2,
    });
  }, [props.width]);

  const goBackHistory = () => {
    window.history.back();
  };

  const setFullScreen = () => {
    if (document.fullscreenElement == null) {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
      } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
      } else if (document.body.webkitRequestFullscreen) {
        document.body.webkitRequestFullscreen();
      } else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen();
      }
      let toastContainer = document.getElementById("toast-container");
      toastContainer.style.backgroundColor = "white";
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  const toggleIsPlaying = () => {
    isPlaying ? setIsPlaying(false) : setIsPlaying(true);
  };

  const updateVideoTime = (skipInterval) => {
    const currentTime = videoPlayerRef.current.getCurrentTime();
    videoPlayerRef.current.seekTo(currentTime + skipInterval);
  };

  return (
    <div className={styles[`video-container`]}>
      <div className={styles[`video-view-controller-container`]}>
        <img alt={`slid close button`} src={`../../design/assets/slid_video_close_icon.png`} className={styles[`video-view-icon`]} onClick={goBackHistory} />
        <img alt={`slid fullScreen button`} src={`../../design/assets/slid_video_${isFullScreen ? "shrink" : "expand"}_icon.png`} className={styles[`video-view-icon`]} onClick={setFullScreen} />
      </div>
      <div className={`${styles[`video-placeholder-container`]}`}>
        <div id="video-size-check" ref={videoPlaceholderRef} className={`${styles[`video-placeholder`]}`}>
          <VideoCapture
            selectAreaCoordinate={selectAreaCoordinate}
            setSelectAreaCoordinate={setSelectAreaCoordinate}
            setCaptureImgData={setCaptureImgData}
            showSelectAreaCanvas={showSelectAreaCanvas}
            videoPlayerRef={videoPlayerRef}
            videoPlaceholderRef={videoPlaceholderRef}
            isCapturingOneClick={isCapturingOneClick}
            setIsCapturingOneClick={setIsCapturingOneClick}
            captureImgData={captureImgData}
          />
          <ReactPlayer
            id="videoPlayer"
            className={styles[`video-player`]}
            url="../../slid_video.mp4"
            playing={isPlaying}
            ref={videoPlayerRef}
            width="100%"
            height="100%"
            onReady={() => {
              setIsPlaying(false);
            }}
            onPlay={() => {
              setIsPlaying(true);
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
            onError={() => {
              setVideoState("unavailable");
            }}
            controls={true}
            playbackRate={playbackSpeed}
            config={{
              file: {
                attributes: {
                  onContextMenu: (e) => e.preventDefault(),
                  controlsList: "nodownload",
                  crossOrigin: "anonymous",
                },
              },
            }}
          />
        </div>
      </div>

      <div className={styles[`video-play-controller-container`]}>
        <div className={styles[`setting-container`]}>
          <Dropdown drop={"right"}>
            <Dropdown.Toggle variant={"white"} className={styles[`setting-toggle`]}>
              <img alt={`setting icon img`} className={styles[`setting-icon`]} src={`../../design/assets/slid_setting_icon.png`} />
              <span>Video Setting</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles[`setting-popup`]}>
              <div>
                <span className={styles[`setting-title`]}>{lang === "ko-KR" ? "동영상 설정" : "Video Setting"} </span>
              </div>
              <div>
                <div className={`${styles[`setting-option`]}`}>
                  <span>{lang === "ko-KR" ? "구간 이동 간격" : "Skip interval"}</span>
                  <select
                    className={`${styles[`select`]} custom-select custom-select-sm`}
                    value={skipInterval}
                    onChange={(event) => {
                      setSkipInterval(parseInt(event.target.value));
                    }}
                  >
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                  </select>
                </div>
                <div className={`${styles[`setting-option`]}`}>
                  <span>{lang === "ko-KR" ? "재생 속도" : "Playback Speed"}</span>
                  <select
                    className={`${styles[`select`]} custom-select custom-select-sm`}
                    value={playbackSpeed}
                    onChange={(event) => {
                      setPlaybackSpeed(parseFloat(event.target.value));
                    }}
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={1.75}>1.75x</option>
                    <option value={2}>2x</option>
                    <option value={2.25}>2.25x</option>
                    <option value={2.5}>2.5x</option>
                  </select>
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <div className={styles[`control-container`]}>
            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip className={`shortcut-tooltip`}>{lang === "ko-KR" ? `${skipInterval}초 뒤로 (${isMacOs ? "Cmd + J" : "Alt + J"})` : `Rewind (${isMacOs ? "Cmd + J" : "Alt + J"})`}</Tooltip>
              }
            >
              <button
                className={`${styles[`skip-btn`]} ${styles[`skip-backward-btn`]} btn btn-secondary`}
                onClick={() => {
                  updateVideoTime(-skipInterval);
                }}
              >
                -{skipInterval} <img alt={`skip backward button`} className={`${styles[`skip-backward`]}`} src={`../../design/assets/slid_backward_white_icon.png`} />
              </button>
            </OverlayTrigger>

            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip className={`shortcut-tooltip`}>
                  {{ isPlaying }
                    ? lang === "ko-KR"
                      ? `일시정지 (${isMacOs ? "Cmd + K" : "Alt + K"})`
                      : `Pause (${isMacOs ? "Cmd + K" : "Alt + K"})`
                    : lang === "ko-KR"
                    ? `재생 (${isMacOs ? "Cmd + K" : "Alt + K"})`
                    : `Play (${isMacOs ? "Cmd + K" : "Alt + K"})`}
                </Tooltip>
              }
            >
              <button className={`${styles[`play-btn`]} btn btn-light`} onClick={toggleIsPlaying}>
                <img alt={`play pause button`} className={styles[`video-icon`]} src={`../../design/assets/slid_${isPlaying ? "pause" : "play"}_btn_icon.png`} />
              </button>
            </OverlayTrigger>

            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip className={`shortcut-tooltip`}>
                  {lang === "ko-KR" ? `${skipInterval}초 앞으로 (${isMacOs ? "Cmd + L" : "Alt + L"})` : `Fast-forward (${isMacOs ? "Cmd + L" : "Alt + L"})`}
                </Tooltip>
              }
            >
              <button
                className={`${styles[`skip-btn`]} ${styles[`skip-forward-btn`]} btn btn-secondary`}
                onClick={() => {
                  updateVideoTime(skipInterval);
                }}
              >
                <img alt={`skip forward button`} className={`${styles[`skip-forward`]}`} src={`../../design/assets/slid_forward_white_icon.png`} />+{skipInterval}
              </button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
