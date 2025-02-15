import * as faceapi from "face-api.js";
import { useEffect} from "react";

const analyzeFace = async () => {
  const video = myVideo.current;
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    if (detections.length > 0) {
      console.log("Detected Emotions:", detections[0].expressions);
    }
  }, 2000);
};

useEffect(() => {
  analyzeFace();
}, []);
