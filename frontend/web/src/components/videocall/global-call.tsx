import { useEffect, useState } from 'react';
import { CallPopup, IncomingCall } from '.';
import { useCall } from '../../contexts/call-context';
import { useSocket } from '../../contexts/socket-context';
import { useAuth } from '../../contexts/auth-context';

const GlobalCall = () => {
  const { callStatus, setCallStatus, callee, setCallee, incomingCall } =
    useCall();
  const { socket } = useSocket();
  const { user } = useAuth();

  const [openCallPopup, setOpenCallPopup] = useState<boolean>(false);
  const [openRingingPopup, setOpenRingingPopup] = useState<boolean>(false);

  useEffect(() => {
    if (callStatus == 'calling' || callStatus == 'in-call') {
      setOpenRingingPopup(false);
      setOpenCallPopup(true);
    } else if (callStatus == 'ringing') setOpenRingingPopup(true);
    else setOpenCallPopup(false);
  }, [callStatus]);

  const onAccept = () => {
    setCallStatus('in-call');
    setCallee(incomingCall?.caller);

    socket?.emit('accept-call', {
      caller: incomingCall?.caller,
      callee: user._id,
      channel: incomingCall?.channel,
    });
  };

  const onClose = () => {
    setCallStatus('idle');

    socket?.emit('end-call', {
      user: callee.id,
      channel: incomingCall?.channel,
    });
  }

  return (
    <>
      {openCallPopup && incomingCall && (
        <CallPopup
          isOpen={true}
          onClose={onClose}
          callee={callee}
          minimized={false}
          onMinimize={function (): void {
            throw new Error('Function not implemented.');
          }}
          onExpand={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      )}
      {openRingingPopup && (
        <IncomingCall
          caller={incomingCall?.caller}
          onAccept={onAccept}
          onDecline={onClose}
          visible={true}
        />
      )}
    </>
  );
};

export default GlobalCall;
