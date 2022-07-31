import React, { useEffect, useRef, useState } from "react";
import styles from "./WebSocket.module.css";
import nvision from "../../../node_modules/@nipacloud/nvision/dist/browser/nvision.js";

function WebSocket() {
  // variables
  const [resultImage, setResultImage] = useState("");

  const [isStarted, setIsStarted] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const video_ref = useRef(null);
  const photo_ref = useRef(null);

  // arrow function
  const getVideo = async () => {
    if (!isStarted) {
      setIsStarted(true);
      await navigator.mediaDevices
        .getUserMedia({
          video: { width: 800, height: 500 },
        })
        .then((stream) => {
          let video = video_ref.current;
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIsStarted(false);

      let stream = video_ref.current;
      const tracks = stream.srcObject;
      await tracks.getVideoTracks()[0].stop();
    }
  };

  const takePhoto = () => {
    const width = 800;
    const height = 500;

    let video = video_ref.current;
    let photo = photo_ref.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    setIsSnapped(true);
  };

  // return html variables
  const startCam = isStarted ? (
    <video ref={video_ref}></video>
  ) : (
    <div>camera is not started.</div>
  );

  // test
  const callAPI = async () => {
    const photo = photo_ref.current;
    const str = photo.toDataURL().replace(/data:.+;base64,/, "");

    const objectDetectionService = nvision.objectDetection({
      apiKey: process.env.REACT_APP_API_KEY,
    });

    objectDetectionService
      .predict({
        rawData: str,
        outputCroppedImage: true,
        outputVisualizedImage: true,
      })
      .then((result) => {
        setResultImage(result.raw_data);
        setDetectedObject(result.detected_objects);
        setIsLoading(false);
      });
  };
  const content = isLoading ? (
    <div>
      <canvas ref={photo_ref}></canvas>
    </div>
  ) : (
    <div>
      <img
        src={"data:" + "png" + ";base64," + resultImage}
        style={{ height: "500px" }}
      />
    </div>
  );

  return (
    <>
      <div className="button_camera_section">
        <input
          type={"button"}
          onClick={getVideo}
          value={"START/STOP Camera"}
          className={styles.cameraButton}
        />
        <input
          type={"button"}
          onClick={takePhoto}
          value={"SNAP"}
          className={styles.snapButton}
        />
      </div>
      <div className={styles.cameraCard}>{startCam}</div>

      <div className={styles.resultCard}>
        {content}
        <input type={"button"} onClick={callAPI} value={"Call API"} />
      </div>
    </>
  );
}

export default WebSocket;
