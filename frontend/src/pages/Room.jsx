import React from "react";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useStore } from "../store/store.js";

uuidv4();

const API_URL = import.meta.env.VITE_API_URL;

const socket = io.connect(`${API_URL}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const Room = () => {
  const { user } = useStore();

  const [roomName, setRoomName] = useState("");
  const [joinRoomID, setJoinRoomID] = useState("");

  const ref = useRef();
  const myVideo = useRef();
  const myAudio = useRef();
  const streamRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        ref.current.srcObject = stream;
        stream.getTracks().forEach((track) => (track.enabled = false));
        const videoTrack = streamRef.current.getVideoTracks()[0];
        videoTrack.stop();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const createRoom = () => {
    const rid = uuidv4();
    socket.emit("create-room", { roomId: rid, roomName });
    navigate(`/createroom/${rid}`);
  };

  const joinRoom = () => {
    if (joinRoomID.trim() === "") {
      alert("Please enter a valid Room ID");
      return;
    }
    socket.emit("join-room", joinRoomID); // Emit room join with ID
    navigate(`/createroom/${joinRoomID}`);
  };

  const handleVoice = () => {
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled; // Toggle audio track
      myAudio.current.firstChild.src = audioTrack.enabled
        ? "./mic.png"
        : "./no-noise.png";
    }
  };

  const handleVideo = async () => {
    const videoTrack = streamRef.current.getVideoTracks()[0];

    if (videoTrack) {
        if(videoTrack.enabled){
            videoTrack.enabled = false;
            videoTrack.stop();
            myVideo.current.firstChild.src = './no-video.png'
        }
        else{
           await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
           .then((stream) => {
               streamRef.current = stream;
              ref.current.srcObject = stream;
           }).catch((err)=>{
            console.log(err)
           })
           videoTrack.enabled = true;
           myVideo.current.firstChild.src = './video-camera.png'
        }
    }
  };

  return (
    <div className="flex gap-4 justify-center items-center relative">
      <video
        ref={ref}
        muted
        autoPlay
        playsInline
        className="w-[500px] h-[600px]"
      ></video>

      <button
        onClick={handleVoice}
        ref={myAudio}
        className="absolute transition text-white rounded-full p-3 bg-gray-300 left-80 bottom-32 mx-10"
      >
        <img src="./no-noise.png" alt="mic" className="w-7" />
      </button>
      <button
        onClick={handleVideo}
        ref={myVideo}
        className="absolute transition text-white rounded-full p-3 bg-gray-300 left-96 bottom-32 mx-12"
      >
        <img src="./no-video.png" alt="no-video" className="w-7" />
      </button>

      <section className="text-gray-600 body-font">
        <div className="container mx-auto px-5 py-24 md:flex-row flex justify-center items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <div className="flex flex-col justify-center items-center container mx-auto gap-4">
              <input
                type="text"
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter Room Name"
                value={roomName}
                className="border border-black px-4 py-2 text-lg rounded-lg w-[30vw]"
              />
              <button
                onClick={createRoom}
                className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:bg-indigo-200"
                disabled={roomName.length < 5}
              >
                Create Room ( Should be at least 5 characters long )
              </button>
              <input
                type="text"
                onChange={(e) => setJoinRoomID(e.target.value)}
                placeholder="Enter Room ID"
                value={joinRoomID}
                className="border border-black px-4 py-2 text-lg rounded-lg w-[30vw]"
              />

              <button
                onClick={joinRoom}
                className="ml-4 inline-flex text-gray-800 bg-gray-300 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
              >
                Join Room
              </button>

              <Link
                to={"/"}
                className=" bg-orange-400 text-white px-4 py-2 rounded-lg"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Room;
