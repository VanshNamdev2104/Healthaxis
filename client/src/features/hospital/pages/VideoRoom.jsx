import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import { PhoneOff, Video, VideoOff, Mic, MicOff, ShieldCheck, Loader2 } from "lucide-react";
import axiosInstance from "../../../lib/api/axiosConfig.js";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const iceServersConfig = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
    ]
};

export default function VideoRoom({ roomId, localStream, onLeave }) {
    const [remoteStream, setRemoteStream] = useState(null);
    const [connected, setConnected] = useState(false);
    const [micActive, setMicActive] = useState(true);
    const [videoActive, setVideoActive] = useState(true);
    const [calling, setCalling] = useState(false);

    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        // Log start call log session
        axiosInstance.post("/api/calls/start", { roomId }).catch(err => {
            console.error("Failed to start call log:", err);
        });

        // 1. Connect to WebSocket signaling server
        socketRef.current = io(BACKEND_URL, {
            withCredentials: true
        });

        socketRef.current.on("connect", () => {
            console.log("Connected to signaling server, joining room:", roomId);
            socketRef.current.emit("join", roomId);
        });

        // 2. Initialize Peer Connection
        peerRef.current = new RTCPeerConnection(iceServersConfig);

        // Add local stream tracks to connection
        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerRef.current.addTrack(track, localStream);
            });
        }

        // Attach local preview stream
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }

        // Remote stream track listener
        peerRef.current.ontrack = (event) => {
            console.log("Received remote track:", event.streams[0]);
            setRemoteStream(event.streams[0]);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
            setConnected(true);
            setCalling(false);
        };

        // ICE candidate handler
        peerRef.current.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit("ice-candidate", {
                    to: roomId,
                    candidate: event.candidate
                });
            }
        };

        // 3. Signaling socket events listeners
        socketRef.current.on("incoming-call", async ({ offer }) => {
            console.log("Received incoming WebRTC offer");
            try {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerRef.current.createAnswer();
                await peerRef.current.setLocalDescription(answer);
                socketRef.current.emit("call-accepted", { to: roomId, answer });
                setConnected(true);
            } catch (err) {
                console.error("Error handling incoming call offer", err);
            }
        });

        socketRef.current.on("call-connected", async ({ answer }) => {
            console.log("Call accepted by remote peer");
            try {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                setConnected(true);
                setCalling(false);
            } catch (err) {
                console.error("Error setting call answer", err);
            }
        });

        socketRef.current.on("ice-candidate", async ({ candidate }) => {
            console.log("Adding remote ICE candidate");
            try {
                if (peerRef.current) {
                    await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (err) {
                console.error("Error adding ice candidate", err);
            }
        });

        socketRef.current.on("call-ended", () => {
            console.log("Call terminated by peer");
            handleHangUp(false);
        });

        return () => {
            cleanup();
        };
    }, [roomId, localStream]);

    const initiateCall = async () => {
        setCalling(true);
        try {
            console.log("Creating WebRTC call offer...");
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socketRef.current.emit("call-user", { to: roomId, offer });
        } catch (err) {
            console.error("Failed to initiate call", err);
            setCalling(false);
        }
    };

    const toggleMic = () => {
        if (localStream) {
            const track = localStream.getAudioTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setMicActive(track.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const track = localStream.getVideoTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setVideoActive(track.enabled);
            }
        }
    };

    const cleanup = () => {
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };

    const handleHangUp = async (shouldNotify = true) => {
        if (shouldNotify && socketRef.current) {
            socketRef.current.emit("end-call", { to: roomId });
        }
        
        // Log end call log session
        try {
            await axiosInstance.post("/api/calls/end", { roomId });
        } catch (err) {
            console.error("Failed to end call log:", err);
        }

        cleanup();
        onLeave();
    };

    return (
        <div className="flex-1 bg-slate-950 flex flex-col justify-between p-6 relative overflow-hidden h-screen text-white">
            {/* Top Bar Info */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 pointer-events-auto">
                    <div className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`}></div>
                    <span className="text-xs font-bold tracking-wide">
                        {connected ? `Consult Room: ${roomId}` : "Waiting for other participant..."}
                    </span>
                </div>

                <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-1.5 pointer-events-auto text-[10px] font-bold text-slate-350">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    HIPAA Secure Channel
                </div>
            </div>

            {/* Video Streams Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center my-14">
                {/* Local Video Stream Frame */}
                <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-2xl">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-slate-900/60 backdrop-blur px-3 py-1 rounded-xl text-[10px] font-bold border border-white/10">
                        You
                    </div>
                </div>

                {/* Remote Video Stream Frame */}
                <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-2xl">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-500">
                            {calling ? (
                                <>
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                                    <span className="text-xs font-bold text-slate-400">Calling...</span>
                                </>
                            ) : (
                                <>
                                    <div className="h-14 w-14 rounded-full bg-slate-850 flex items-center justify-center text-slate-650 text-2xl font-black mb-1">
                                        P
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">Consultation Session Idle</span>
                                    {!connected && (
                                        <button
                                            type="button"
                                            onClick={initiateCall}
                                            className="mt-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-97 pointer-events-auto"
                                        >
                                            Connect Call
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {remoteStream && (
                        <div className="absolute bottom-4 left-4 bg-slate-900/60 backdrop-blur px-3 py-1 rounded-xl text-[10px] font-bold border border-white/10">
                            Consultant
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Controls Panel */}
            <div className="flex items-center justify-center gap-4.5 pb-4 z-20">
                <button
                    onClick={toggleMic}
                    className={`p-3.5 rounded-full cursor-pointer border transition-all hover:scale-105 active:scale-95 ${
                        micActive 
                            ? "bg-slate-900/90 text-white border-white/10 hover:bg-slate-800" 
                            : "bg-rose-500 text-white border-rose-600 shadow-lg"
                    }`}
                    title={micActive ? "Mute Mic" : "Unmute Mic"}
                >
                    {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>

                <button
                    onClick={handleHangUp}
                    className="p-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white border border-rose-600 shadow-xl hover:shadow-rose-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
                    title="End Call"
                >
                    <PhoneOff className="h-5.5 w-5.5" />
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-3.5 rounded-full cursor-pointer border transition-all hover:scale-105 active:scale-95 ${
                        videoActive 
                            ? "bg-slate-900/90 text-white border-white/10 hover:bg-slate-800" 
                            : "bg-rose-500 text-white border-rose-600 shadow-lg"
                    }`}
                    title={videoActive ? "Turn Off Camera" : "Turn On Camera"}
                >
                    {videoActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
}

VideoRoom.propTypes = {
    roomId: PropTypes.string.isRequired,
    localStream: PropTypes.object,
    onLeave: PropTypes.func.isRequired
};
