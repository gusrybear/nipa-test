import React, { useEffect, useRef, useState } from "react";
import nvision from "../../../node_modules/@nipacloud/nvision/dist/browser/nvision.js";
import styles from "./Rest.module.css";
import { BsImageAlt } from "react-icons/bs";
import styled from "styled-components";
// styled-component
const Button = styled.button`
  background: transparent;
  border-radius: 50%;
  border: 0px solid black;
  color: gray;
  width: 60px;
  height: 60px;
  box-shadow: 1px 1px 5px #888888;
  &:hover,
  &:focus {
    border: 3px solid black;
  }
  &:active {
    background-color: #d9d9d9;
  }
`;
function Rest() {
  //-->>> variables <<<--
  const [baseImage, setBaseImage] = useState("");
  const [detectedObject, setDetectedObject] = useState([]);
  const [resultImage, setResultImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // jpeg or png
  const [type, setType] = useState("");

  //-->>> functions <<<--
  const fileSelectHandler = async (event) => {
    const file = event.target.files[0];
    const fileType = file.type;
    setType(fileType);
    const base64 = await convertBase64(file);
    setBaseImage(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const callApi = () => {
    const str = baseImage.replace(/data:.+;base64,/, "");
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
      <img src={baseImage} style={{ height: "500px" }} />
    </div>
  ) : (
    <div>
      <img
        src={"data:" + { type } + ";base64," + resultImage}
        style={{ height: "500px" }}
      />
    </div>
  );

  const hiddenFileInput = useRef(null);

  const handleClickIcon = (event) => {
    hiddenFileInput.current.click();
    setIsLoading(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className="upload">
          <span className={styles.icon}>
            <Button onClick={handleClickIcon}>
              <BsImageAlt size={40} color={"black"} />
            </Button>
            <input
              type={"file"}
              style={{ display: "none" }}
              ref={hiddenFileInput}
              accept="image/png, image/jpeg"
              onChange={(e) => fileSelectHandler(e)}
            />
          </span>
          <input
            type={"file"}
            ref={hiddenFileInput}
            accept="image/png, image/jpeg"
            onChange={(e) => fileSelectHandler(e)}
            onClick={handleClickIcon}
            className={styles.fileInput}
          />
        </div>
        <br />

        <input
          type="button"
          onClick={callApi}
          value="Call"
          className={styles.callButton}
        />

        <br />

        <div className={styles.content}>{content}</div>
      </div>
    </>
  );
}

export default Rest;
