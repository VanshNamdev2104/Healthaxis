import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Video, VideoOff, Mic, MicOff, Settings, Camera } from "lucide-react";

export default function VideoLobby({ roomId, setRoomId, onJoin, localStream, setLocalStream }) {
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [error, setError] = useState("");
    const localVideoRef = useRef(null);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            setError("");
            if (localStream) {
                stopCamera();
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera permission error", err);
            setError("Unable to access camera or microphone. Please check system permissions.");
        }
    };

    const stopCamera = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioEnabled(audioTrack.enabled);
            }
        }
    };

    const handleJoinSubmit = (e) => {
        e.preventDefault();
        if (!roomId.trim()) return;
        onJoin();
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[32px] p-6 max-w-4xl mx-auto shadow-sm flex flex-col md:flex-row gap-8">
            {/* Camera Preview */}
            <div className="flex-1 flex flex-col items-center">
                <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                    {localStream && videoEnabled ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-slate-500 gap-2">
                            <VideoOff className="h-10 w-10" />
                            <span className="text-xs font-bold">Webcam is Turned Off</span>
                        </div>
                    )}

                    {/* Quick overlay controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3.5 bg-slate-900/60 backdrop-blur px-4 py-2.5 rounded-full border border-white/10 shadow-lg">
                        <button
                            type="button"
                            onClick={toggleAudio}
                            className={`p-2 rounded-full cursor-pointer transition-colors ${
                                audioEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-500 text-white"
                            }`}
                        >
                            {audioEnabled ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
                        </button>
                        <button
                            type="button"
                            onClick={toggleVideo}
                            className={`p-2 rounded-full cursor-pointer transition-colors ${
                                videoEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-500 text-white"
                            }`}
                        >
                            {videoEnabled ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-3.5 text-xs text-rose-500 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}
            </div>

            {/* Room ID and Join controls */}
            <div className="w-full md:w-80 flex flex-col justify-between">
                <div>
                    <h3 className="text-slate-800 dark:text-slate-100 font-extrabold text-lg flex items-center gap-2 mb-1.5">
                        <Camera className="h-5 w-5 text-indigo-500" />
                        Tele-Consultation Lobby
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                        Test your audio/video and join a pre-scheduled appointment consult room using a unique code.
                    </p>
                </div>

                <form onSubmit={handleJoinSubmit} className="space-y-4 my-6">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 pl-0.5">
                            Enter Meeting Room Code
                        </label>
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="e.g. appt-1234-5678"
                            required
                            className="w-full px-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all font-bold tracking-wider uppercase text-center"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!roomId.trim() || !localStream}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer transition-all disabled:opacity-50"
                    >
                        Join Consultation Room
                    </button>
                </form>

                <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-4 text-[10px] text-slate-400 font-medium">
                    <Settings className="h-4 w-4 text-slate-400" />
                    WebRTC connection is fully secure and encrypted.
                </div>
            </div>
        </div>
    );
}

VideoLobby.propTypes = {
    roomId: PropTypes.string.isRequired,
    setRoomId: PropTypes.func.isRequired,
    onJoin: PropTypes.func.isRequired,
    localStream: PropTypes.object,
    setLocalStream: PropTypes.func.isRequired
};
