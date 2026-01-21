
import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Waves, Volume2, Shield, Camera, Zap } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import { encode, decode, decodeAudioData, blobToBase64 } from '../../utils/audioUtils';
import { securityTools } from '../../services/api';

interface LiveVoiceOverlayProps {
  onClose: () => void;
}

const LiveVoiceOverlay: React.FC<LiveVoiceOverlayProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const frameIntervalRef = useRef<number | null>(null);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ 
                  media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
                });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            // Frame Capture Loop (Vision Security)
            frameIntervalRef.current = window.setInterval(() => {
              if (videoRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
                canvasRef.current.toBlob(async (blob) => {
                  if (blob) {
                    const base64 = await blobToBase64(blob);
                    sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } }));
                  }
                }, 'image/jpeg', 0.5);
              }
            }, 2000);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.toolCall) {
              message.toolCall.functionCalls.forEach(fc => {
                if (fc.name === 'triggerEmergencyAlert') {
                  setSecurityAlert(`EMERGENCY: ${fc.args.reason}`);
                }
                sessionPromise.then(s => s.sendToolResponse({ 
                  functionResponses: { id: fc.id, name: fc.name, response: { result: "Protocol Initiated" } } 
                }));
              });
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => console.error(e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: securityTools }],
          systemInstruction: "You are the Aura Guardian. You have access to real-time vision and audio. Monitor for: 1. Violence/Weapons (Alert immediately). 2. Distress cries (Help, Stop, etc.). 3. Automated robotic assistance commands. Be fast, direct, and robotic.",
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    setIsActive(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[85vh]">
        <div className="flex-1 flex flex-col p-8 relative">
           <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-all"><X size={24} /></button>
           
           <div className="flex items-center gap-4 mb-8">
             <div className="p-3 bg-red-600/20 rounded-2xl text-red-500"><Shield size={24} /></div>
             <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Aura_Guardian_Mode</h2>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Multimodal Security Listening</p>
             </div>
           </div>

           <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-0">
             <div className="relative rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-2xl">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-60" />
                <canvas ref={canvasRef} className="hidden" width="320" height="240" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-start">
                    <div className="text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> SCANNING_ENV
                    </div>
                  </div>
                  <div className="w-full h-px bg-red-500/20 animate-scan" />
                </div>
             </div>

             <div className="flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                   <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.4)] scale-110' : 'bg-slate-800'}`}>
                     {isActive ? <Mic size={40} className="text-white animate-pulse" /> : <MicOff size={40} className="text-slate-500" />}
                   </div>
                   <div>
                     <h3 className="text-lg font-black text-white uppercase tracking-wider">{isActive ? "Guard Active" : "Sensor Array Disabled"}</h3>
                     <p className="text-xs text-slate-500 mt-2">Guardian is listening for distress and monitoring vision frames.</p>
                   </div>
                   {securityAlert && (
                     <div className="w-full p-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest animate-bounce">
                        {securityAlert}
                     </div>
                   )}
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aura_Status</span>
                     <span className="text-[10px] font-mono text-green-500">STABLE</span>
                   </div>
                   <div className="flex gap-2">
                     {!isActive ? (
                       <button onClick={startSession} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">Enable Intelligence</button>
                     ) : (
                       <button onClick={stopSession} className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">Terminate Session</button>
                     )}
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceOverlay;
