import React, { useState } from "react";
import VideoLobby from "../components/VideoLobby.jsx";
import VideoRoom from "./VideoRoom.jsx";

export default function VideoConsultation() {
    const [inCall, setInCall] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [localStream, setLocalStream] = useState(null);

    const handleJoin = () => {
        if (!roomId.trim()) return;
        setInCall(true);
    };

    const handleLeave = () => {
        setInCall(false);
        // Stop local tracks
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50/20 dark:bg-slate-950/10">
            {inCall ? (
                <VideoRoom
                    roomId={roomId}
                    localStream={localStream}
                    onLeave={handleLeave}
                />
            ) : (
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="mb-6 max-w-4xl mx-auto w-full">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                            Video Consultation
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            Connect securely with certified clinical experts via encrypted WebRTC channels.
                        </p>
                    </div>

                    <VideoLobby
                        roomId={roomId}
                        setRoomId={setRoomId}
                        onJoin={handleJoin}
                        localStream={localStream}
                        setLocalStream={setLocalStream}
                    />
                </div>
            )}
        </div>
    );
}
