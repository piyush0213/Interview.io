import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { BsTelephoneX } from "react-icons/bs";
import Chat from "../components/Chat";
import { useStore } from "../store/store.js";

const API_URL = import.meta.env.VITE_API_URL;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // Add your OpenAI API key to .env

const socket = io.connect(`${API_URL}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const VideoCall = () => {
  const { user } = useStore();
  const [role, setRole] = useState(user.role);
  const [peers, setPeers] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [language, setLanguage] = useState("en-US"); // Default to English
  const [aiInsights, setAiInsights] = useState(""); // State to store AI insights
  const recognitionRef = useRef(null);
  const screenVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const videoContainer = useRef();
  const myVideo = useRef(null);
  const peersRef = useRef({});
  const streamRef = useRef(null);
  const myVoice = useRef(null);
  const videoRef = useRef(null);
  const hiddenVoice = useRef(null);
  const navigate = useNavigate();
  const params = useParams();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Function to detect language based on text
  const detectLanguage = (text) => {
    const hindiRegex = /[\u0900-\u097F]/;
    return hindiRegex.test(text) ? "hi-IN" : "en-US";
  };

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Web Speech API is not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const detectedLanguage = detectLanguage(finalTranscript);
      if (detectedLanguage !== language) {
        setLanguage(detectedLanguage);
        recognitionRef.current.lang = detectedLanguage;
      }

      setTranscribedText((prev) => prev + finalTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  }, [language]);

  // Analyze transcribed text using OpenAI
  const analyzeTextWithAI = async (text) => {
    const maxRetries = 3; // Maximum number of retries
    let retryCount = 0;
  
    const makeRequest = async () => {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `Analyze the following text and provide insights on areas of improvement, strengths, and additional feedback:\n\n${text}`,
              },
            ],
            max_tokens: 500,
          }),
        });
  
        if (!response.ok) {
          if (response.status === 429 && retryCount < maxRetries) {
            // Retry after a delay (exponential backoff)
            const delay = Math.pow(2, retryCount) * 1000; // Delay in milliseconds
            retryCount++;
            console.log(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return makeRequest();
          } else {
            throw new Error(`API request failed with status ${response.status}`);
          }
        }
  
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          setAiInsights(data.choices[0].message.content);
        } else {
          setAiInsights("Failed to generate insights. Please try again.");
        }
      } catch (error) {
        console.error("Error analyzing text with AI:", error);
        setAiInsights("Error analyzing text. Please check your connection.");
      }
    };
  
    makeRequest();
  };

  // Throttle AI insights generation
  useEffect(() => {
    let timeoutId;

    if (transcribedText && !isRecording) {
      timeoutId = setTimeout(() => {
        analyzeTextWithAI(transcribedText);
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [transcribedText, isRecording]);

  // Start/stop speech recognition
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Handle microphone toggle
  const handleVoice = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  // Handle video toggle
  const handleVideo = () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  };

  // Handle screen sharing
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenVideoRef.current.srcObject = screenStream;
      screenStreamRef.current = screenStream;
      setIsSharing(true);

      videoContainer.current.classList.remove("hidden");

      screenStream.getVideoTracks()[0].onended = () => stopScreenShare();
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  // Stop screen sharing
  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      videoContainer.current.classList.add("hidden");
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      setIsSharing(false);
    }
  };

  // Handle disconnecting from the call
  const handleDisconnect = () => {
    socket.emit("disconnect-from-room", params.id);
    navigate("/createroom");
  };

  // Get user media stream
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMediaError("Your browser does not support media devices.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        // Join the room
        socket.emit("join-room", params.id);

        // Handle incoming users
        socket.on("all-users", (users) => {
          setUserCount(users.length + 1);
          users.forEach((userID) => {
            if (!peersRef.current[userID]) {
              const peer = createPeer(userID, socket.id, stream);
              peersRef.current[userID] = peer;
              setPeers((prevPeers) => [...prevPeers, { peerID: userID, peer }]);
            }
          });
        });

        // Handle new user joining
        socket.on("user-joined", (payload) => {
          setUserCount((prevCount) => prevCount + 1);

          if (!peersRef.current[payload.callerID]) {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current[payload.callerID] = peer;
            setPeers((prevPeers) => [
              ...prevPeers,
              { peerID: payload.callerID, peer },
            ]);
          }
        });

        // Handle returning signal
        socket.on("receiving-returned-signal", (payload) => {
          const peer = peersRef.current[payload.id];
          if (peer && !peer.destroyed) {
            try {
              peer.signal(payload.signal);
            } catch (err) {
              console.log("Error signaling peer:", err);
              removePeer(payload.id);
            }
          }
        });

        // Handle user disconnection
        socket.on("user-disconnected", (userId) => {
          setUserCount((prevCount) => prevCount - 1);
          removePeer(userId);
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        setMediaError("Failed to access camera and microphone. Please grant permissions.");
      });
  }, [params.id]);

  // Create a peer connection
  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      if (signal.type === "offer") {
        socket.emit("sending-signal", { userToSignal, callerID, signal });
      }
    });

    peer.on("error", (err) => {
      console.log("Peer error: ", err);
      if (err.toString().includes("Connection failed")) {
        removePeer(userToSignal);
      }
    });

    return peer;
  };

  // Add a peer connection
  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      if (signal.type === "answer") {
        socket.emit("returning-signal", { signal, callerID });
      }
    });

    peer.on("error", (err) => {
      console.log("Peer error: ", err);
      if (err.toString().includes("Connection failed")) {
        removePeer(callerID);
      }
    });

    try {
      peer.signal(incomingSignal);
    } catch (err) {
      console.error("Error signaling peer:", err);
    }

    return peer;
  };

  // Remove a peer connection
  const removePeer = (peerId) => {
    console.log("Removing peer:", peerId);
    if (peersRef.current[peerId]) {
      peersRef.current[peerId].destroy();
      delete peersRef.current[peerId];
    }
    setPeers((prevPeers) => prevPeers.filter((p) => p.peerID !== peerId));
  };

  return (
    <>
      <div className="p-8">
        {mediaError && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {mediaError}
          </div>
        )}

        <div ref={videoContainer} className="p-8 hidden">
          <div className="flex justify-center items-center">
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              className="max-w-lg h-auto border-4 border-green-400 rounded-lg w-[1/2]"
            />
          </div>
        </div>

        <div className="video-container flex justify-start items-center flex-wrap gap-2 ">
          <div className="relative flex flex-col flex-wrap gap-2">
            <img
              ref={hiddenVoice}
              className="absolute right-0 top-0 bg-gray-500 bg-opacity-60 text-white px-2 py-1 rounded w-[50px]"
              src="https://static.thenounproject.com/png/55394-200.png"
              alt=""
            />
            <video
              autoPlay
              playsInline
              muted
              ref={myVideo}
              width={450}
              className="rounded-lg h-auto"
            ></video>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              You ({role})
            </div>
            {peers.map((peer, index) => (
              <Video key={index} peer={peer.peer} />
            ))}
          </div>

          <Chat />
        </div>

        <div className="buttons flex gap-2 justify-center mt-2">
          <button
            ref={myVoice}
            onClick={handleVoice}
            className="flex flex-col items-center justify-center bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition"
          >
            <img
              className="w-8 h-8"
              src={
                isMicOn
                  ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVlammuTgsznsVxo_c28htj4ijktv1Zn-e5Q&s"
                  : "https://static.thenounproject.com/png/55394-200.png"
              }
              alt="Microphone"
            />
            <span className="text-sm mt-1">{isMicOn ? "Mic On" : "Mic Off"}</span>
          </button>

          <button
            onClick={handleVideo}
            className="flex flex-col items-center justify-center bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition"
          >
            <img
              className="w-8 h-8"
              src={
                isVideoOn
                  ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQluBqQsuDBhSvoer2xf4D5kfHj3CQUizs9kw&s"
                  : "https://www.iconpacks.net/icons/4/free-no-video-icon-13736-thumb.png"
              }
              alt="Video"
            />
            <span className="text-sm mt-1">{isVideoOn ? "Video On" : "Video Off"}</span>
          </button>

          {!isSharing ? (
            <button
              onClick={startScreenShare}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Start Screen Share
            </button>
          ) : (
            <button
              onClick={stopScreenShare}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Stop Screen Share
            </button>
          )}

          <button
            onClick={toggleRecording}
            className={`px-4 py-2 ${
              isRecording ? "bg-red-500" : "bg-blue-500"
            } text-white rounded-lg hover:bg-${isRecording ? "red-600" : "blue-600"}`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>

          <button
            onClick={handleDisconnect}
            className="bg-[#dc263e] hover:bg-red-500 w-28 transition text-white rounded-full p-3 flex justify-center items-center"
          >
            <BsTelephoneX className="text-2xl" />
          </button>
        </div>

        <div className="transcription-container mt-4 p-4 bg-gray-800 text-white rounded-lg">
          <h3 className="font-bold">Interview Transcription</h3>
          <p>{transcribedText}</p>
        </div>

        <div className="ai-insights-container mt-4 p-4 bg-gray-800 text-white rounded-lg">
          <h3 className="font-bold">AI Insights</h3>
          <p>{aiInsights}</p>
        </div>
      </div>
    </>
  );
};

const Video = ({ peer }) => {
  const ref = useRef();
  const hiddenPeerVoice = useRef();

  useEffect(() => {
    if (peer) {
      peer.on("stream", (stream) => {
        if (ref.current) {
          ref.current.srcObject = stream;
        }
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack.enabled === false) {
          hiddenPeerVoice.current.style.display = "block";
        } else {
          hiddenPeerVoice.current.style.display = "none";
        }
      });
    }
  }, [peer]);

  return (
    <div className="relative">
      <video
        autoPlay
        playsInline
        ref={ref}
        width={450}
        className="rounded-lg h-auto"
      />
      <img
        ref={hiddenPeerVoice}
        className="absolute top-2 left-2 bg-gray-500 bg-opacity-60 text-white px-2 py-1 rounded w-[50px]"
        src="./no-noise.png"
        alt=""
      />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        Peer
      </div>
    </div>
  );
};

export default VideoCall;