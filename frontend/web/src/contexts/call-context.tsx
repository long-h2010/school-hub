import { createContext, useContext, useState } from 'react';
import type { CallStatus, IncomingCall } from '../types/call';

interface CallContextType {
  callStatus: CallStatus;
  setCallStatus: (value: CallStatus) => void;
  callee: any;
  setCallee: (value: any) => void;
  incomingCall: IncomingCall | null;
  setIncomingCall: (value: IncomingCall | null) => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callee, setCallee] = useState<any>();
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

  return (
    <CallContext.Provider
      value={{ callStatus, setCallStatus, callee, setCallee, incomingCall, setIncomingCall }}
    >
      {children}
    </CallContext.Provider>
  );
};

export function useCall() {
  const context = useContext(CallContext);

  if (!context) {
    throw new Error('useCall must be used within CallProvider');
  }

  return context;
}
