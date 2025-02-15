// client/src/utils/speechToText.js
export function startSpeechRecognition(callback) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + " ";
        }
        callback(transcript);
    };

    recognition.onerror = (event) => console.error("Speech Recognition Error:", event.error);

    recognition.start();
    return recognition;
}

export function stopSpeechRecognition(recognition) {
    if (recognition) recognition.stop();
}
