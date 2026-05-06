import { useState, useEffect, useRef, useCallback } from 'react';
import type { User } from '../../types/user';
import useTimer from '../../hooks/use-timer';
import { useCall } from '../../contexts/call-context';
import { ControlButtons, PopupHeader, VideoArea } from './';
import AgoraRTC from 'agora-rtc-sdk-ng';
import type { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

// type Speaker = 'remote' | 'local';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callee: User;
  minimized: boolean;
  onMinimize: () => void;
  onExpand: () => void;
}

const APP_ID = import.meta.env.VITE_APP_AGORA_ID;
const AGORA_CLIENT = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const CallPopup: React.FC<Props> = ({
  isOpen,
  onClose,
  callee,
  minimized,
  onMinimize,
  // onExpand,
}) => {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const [localTrack, setLocalTrack] = useState<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const [remoteUser, setRemoteUser] = useState<IAgoraRTCRemoteUser | null>(
    null,
  );

  const { incomingCall, callStatus, setCallStatus } = useCall();
  const [muted, setMuted] = useState<boolean>(false);
  const [videoOff, setVideoOff] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);
  // const [speaking, setSpeaking] = useState<Speaker>('remote');
  const [visible, setVisible] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);

  const timer = useTimer(isOpen && !connecting);

  useEffect(() => {
    if (callStatus == 'in-call') setConnecting(true);
  }, [callStatus]);

  useEffect(() => {
    clientRef.current = AGORA_CLIENT;

    AGORA_CLIENT.on(
      'user-published',
      async (user: IAgoraRTCRemoteUser, mediaType) => {
        await AGORA_CLIENT.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUser(user);
        }
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
        }
      },
    );

    AGORA_CLIENT.on('user-unpublished', (user) => {
      if (remoteUser?.uid === user.uid) setRemoteUser(null);
    });

    AGORA_CLIENT.on('user-left', () => {
      setRemoteUser(null);
      onClose?.();
    });

    return () => {
      AGORA_CLIENT.removeAllListeners();
    };
  }, [onClose]);

  // Join channel & publish tracks
  const startCall = useCallback(async () => {
    if (!clientRef.current) return;

    if (!incomingCall?.channel || !incomingCall?.token || !incomingCall?.uid) {
      console.error('No incoming call data available');
      return;
    }

    try {
      await clientRef.current.join(
        APP_ID,
        incomingCall?.channel,
        incomingCall?.token,
        incomingCall?.uid,
      );

      const localAudio = await AgoraRTC.createMicrophoneAudioTrack();
      const localVideo = await AgoraRTC.createCameraVideoTrack();
      setLocalTrack(localVideo);

      await clientRef.current.publish([localAudio, localVideo]);
    } catch (err) {
      console.error('Start Agora call failed:', err);
    }
  }, [APP_ID, incomingCall?.channel, incomingCall?.token, incomingCall?.uid]);

  useEffect(() => {
    if (localTrack && localVideoRef.current) {
      localTrack.play(localVideoRef.current);
    }
  }, [localTrack]);

  // Leave call
  const endCall = useCallback(async () => {
    if (clientRef.current) {
      await clientRef.current.leave();
    }
    setRemoteUser(null);
    onClose?.();
  }, [onClose]);

  // Reset state when a new call opens
  useEffect(() => {
    if (isOpen) {
      setMuted(false);
      setVideoOff(false);
      setSharing(false);

      const t = setTimeout(() => setVisible(true), 10);

      startCall();

      return () => {
        clearTimeout(t);
      };
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // useEffect(() => {
  //   if (!isOpen || !connecting) return;
  //   const t = setTimeout(() => setConnecting(false), 2200);
  //   return () => clearTimeout(t);
  // }, [isOpen, connecting]);

  // useEffect(() => {
  //   if (!isOpen || connecting) return;
  //   const id = setInterval(
  //     () => setSpeaking((s) => (s === 'remote' ? 'local' : 'remote')),
  //     2800,
  //   );
  //   return () => clearInterval(id);
  // }, [isOpen, connecting]);

  // Play remote video
  useEffect(() => {
    if (remoteUser?.videoTrack && remoteVideoRef.current) {
      remoteUser.videoTrack.play(remoteVideoRef.current);
    }
  }, [remoteUser]);

  const handleEnd = () => {
    setCallStatus('idle');
    setVisible(false);
    endCall();
    setTimeout(onClose, 280);
  };

  // Minimized pill is rendered at App level — nothing here when minimized
  if (!isOpen) return null;
  if (minimized) return null;

  return (
    // ✅ pointer-events-none on the backdrop prevents blocking the chat
    <div
      className='fixed inset-0 z-[50000] flex items-center justify-center transition-opacity duration-300'
      style={{
        backdropFilter: 'blur(14px)',
        background: 'rgba(0,0,0,0.72)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className='w-[760px] max-w-[94vw] bg-[#0e1117] rounded-[28px] overflow-hidden border border-white/[0.06] shadow-[0_40px_80px_rgba(0,0,0,0.7)]'
        style={{ animation: 'vcModalIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <PopupHeader
          connecting={connecting}
          sharing={sharing}
          timer={timer}
          onMinimize={onMinimize}
          handleEnd={handleEnd}
        />

        <VideoArea
          localRef={localVideoRef}
          remoteRef={remoteVideoRef}
          callee={callee}
          connecting={connecting}
          muted={muted}
          videoOff={videoOff}
          // speaking={speaking}
        />

        <ControlButtons
          connecting={connecting}
          muted={muted}
          setMuted={setMuted}
          videoOff={videoOff}
          setVideoOff={setVideoOff}
          sharing={sharing}
          setSharing={setSharing}
          handleEnd={handleEnd}
        />
      </div>
    </div>
  );
};

export default CallPopup;
