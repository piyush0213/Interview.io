// client/src/utils/faceAnalysis.js
import * as faceapi from 'face-api.js';

export async function loadFaceApiModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
}

export async function detectFaceExpressions(videoElement) {
    const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
                                    .withFaceExpressions();
    
    if (detections.length > 0) {
        return detections[0].expressions;  // Returns emotions like happy, sad, angry, etc.
    }
    return null;
}
