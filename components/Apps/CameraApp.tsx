
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, ArrowLeft, RefreshCw, Zap, Image as ImageIcon, 
  Settings, X, Download, Share2, Trash2, Sliders, 
  Maximize, Eye, Timer, Aperture, Layers, Filter, CheckCircle
} from 'lucide-react';

const CameraApp: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mode, setMode] = useState<'capture' | 'gallery' | 'edit'>('capture');
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMounted = useRef(true);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    if (!isMounted.current) return;
    setError(null);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("CAMERA_API_UNSUPPORTED");
      return;
    }

    try {
      // First, check if any video devices exist
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        setError("NO_CAMERA_HARDWARE_DETECTED");
        return;
      }

      // Try with idealized constraints first
      const constraints: MediaStreamConstraints = { 
        video: { 
          facingMode: { ideal: facingMode },
          // Remove strict width/height to be more permissive with hardware
        }, 
        audio: false 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!isMounted.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Primary camera access error:", err);
      
      // Fallback: try to get any video stream with no constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!isMounted.current) {
          fallbackStream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackErr: any) {
        console.error("Absolute camera failure:", fallbackErr);
        if (isMounted.current) {
          // Check for common permission or not found errors
          if (fallbackErr.name === 'NotFoundError' || fallbackErr.name === 'DevicesNotFoundError') {
            setError("CAMERA_NOT_FOUND");
          } else if (fallbackErr.name === 'NotAllowedError' || fallbackErr.name === 'PermissionDeniedError') {
            setError("PERMISSION_DENIED");
          } else {
            setError("HARDWARE_FAILURE");
          }
        }
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    if (mode === 'capture') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      isMounted.current = false;
      stopCamera();
    };
  }, [mode, facingMode]);

  const handleCapture = () => {
    if (countdown !== null || error) return;
    
    const captureAction = () => {
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Set canvas size to the video stream resolution
          canvasRef.current.width = videoRef.current.videoWidth || 640;
          canvasRef.current.height = videoRef.current.videoHeight || 480;
          
          // Apply current filters to canvas
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${getFilterCSS(filter)}`;
          
          // If we are using the user (front) camera, we usually want to flip the image to match the mirror view
          if (facingMode === 'user') {
            ctx.translate(canvasRef.current.width, 0);
            ctx.scale(-1, 1);
          }
          
          ctx.drawImage(videoRef.current, 0, 0);
          
          // Reset transform if we flipped it
          if (facingMode === 'user') {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
          }
          
          const dataUrl = canvasRef.current.toDataURL('image/png');
          setCapturedPhotos(prev => [dataUrl, ...prev]);
          
          // Visual feedback (Flash)
          const flash = document.createElement('div');
          flash.className = 'fixed inset-0 bg-white z-[200] opacity-100 pointer-events-none transition-opacity duration-300';
          document.body.appendChild(flash);
          requestAnimationFrame(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
          });
        }
      }
    };

    captureAction();
  };

  const getFilterCSS = (f: string) => {
    switch (f) {
      case 'grayscale': return 'grayscale(100%)';
      case 'sepia': return 'sepia(100%)';
      case 'neon': return 'hue-rotate(90deg) saturate(200%) brightness(120%)';
      case 'night': return 'invert(100%) hue-rotate(180deg) brightness(80%)';
      case 'tactical': return 'contrast(150%) brightness(110%) saturate(0%)';
      default: return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* OS Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Camera size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Aura_Lens</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Optical Neural Sensor</p>
          </div>
        </div>

        <div className="flex gap-2">
           <HeaderBtn icon={<ImageIcon size={16}/>} onClick={() => setMode('gallery')} active={mode === 'gallery'} />
           <HeaderBtn icon={<Settings size={16}/>} onClick={() => {}} />
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        {mode === 'capture' && (
          <>
            {/* Viewfinder */}
            <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center">
               {error ? (
                 <div className="flex flex-col items-center gap-4 text-red-500 p-8 text-center animate-in fade-in duration-500">
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] shadow-2xl">
                       <Zap size={48} className="animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter mb-1">Hardware_Link_Failed</h3>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">{error}</p>
                    </div>
                    <button 
                      onClick={startCamera}
                      className="mt-4 px-8 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-600/30 active:scale-95"
                    >
                      Retry_Link
                    </button>
                 </div>
               ) : (
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted 
                   className="w-full h-full object-cover transition-all duration-500"
                   style={{ 
                     filter: `brightness(${brightness}%) contrast(${contrast}%) ${getFilterCSS(filter)}`,
                     transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                   }}
                 />
               )}
               <canvas ref={canvasRef} className="hidden" />

               {/* Tactical HUD Overlay */}
               {!error && (
                 <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
                    <div className="flex justify-between items-start">
                       <div className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" /> SENSOR_READY
                       </div>
                       <div className="text-[8px] font-black text-white/40 uppercase tracking-widest text-right">
                          RES: TACTICAL_STREAM<br/>ISO: AUTO
                       </div>
                    </div>
                    
                    {/* Viewfinder Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                       <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-red-500 rounded-full" />
                          <div className="absolute top-0 w-px h-8 bg-white/40" />
                          <div className="absolute bottom-0 w-px h-8 bg-white/40" />
                          <div className="absolute left-0 h-px w-8 bg-white/40" />
                          <div className="absolute right-0 h-px w-8 bg-white/40" />
                       </div>
                    </div>

                    <div className="flex justify-between items-end">
                       <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-4 pointer-events-auto">
                          <SliderControl icon={<Maximize size={12}/>} val={brightness} setVal={setBrightness} />
                          <SliderControl icon={<Sliders size={12}/>} val={contrast} setVal={setContrast} />
                       </div>
                       <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest text-right">
                          SCAN_MODE: ACTIVE<br/>F_STOP: DYNAMIC
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Camera Controls Footer */}
            <div className="h-44 bg-slate-950 border-t border-white/5 p-6 flex items-center justify-around z-40">
               <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                    className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all active-scale"
                  >
                     <RefreshCw size={24} />
                  </button>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Switch</span>
               </div>

               <button 
                 onClick={handleCapture}
                 disabled={!!error}
                 className="w-24 h-24 rounded-full border-4 border-white/10 p-1 group active:scale-90 transition-all disabled:opacity-30"
               >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center group-hover:bg-indigo-50 transition-colors shadow-2xl">
                     <div className="w-16 h-16 rounded-full border-2 border-slate-200" />
                  </div>
               </button>

               <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => setMode('gallery')}
                    className="w-14 h-14 bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all active-scale"
                  >
                     {capturedPhotos.length > 0 ? (
                       <img src={capturedPhotos[0]} className="w-full h-full object-cover" alt="" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-700"><ImageIcon size={20}/></div>
                     )}
                  </button>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Vault</span>
               </div>
            </div>

            {/* Filter Tray Overlay */}
            {!error && (
              <div className="absolute bottom-48 left-0 right-0 p-4 flex justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
                 <FilterIcon active={filter === 'none'} label="Clean" onClick={() => setFilter('none')} />
                 <FilterIcon active={filter === 'neon'} label="Neon" onClick={() => setFilter('neon')} />
                 <FilterIcon active={filter === 'grayscale'} label="Gray" onClick={() => setFilter('grayscale')} />
                 <FilterIcon active={filter === 'night'} label="Night" onClick={() => setFilter('night')} />
                 <FilterIcon active={filter === 'tactical'} label="Tac" onClick={() => setFilter('tactical')} />
              </div>
            )}
          </>
        )}

        {mode === 'gallery' && (
          <div className="flex-1 flex flex-col p-8 bg-slate-950 animate-in slide-in-from-right duration-500 overflow-y-auto custom-scrollbar">
             <header className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Lens_Archives</h3>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Stored Visual Packets</p>
                </div>
                <button 
                  onClick={() => setMode('capture')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                >
                  Return_To_Live
                </button>
             </header>

             {capturedPhotos.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-800 opacity-30 gap-6">
                  <ImageIcon size={80} />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">No captures detected.</p>
               </div>
             ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {capturedPhotos.map((photo, i) => (
                    <div 
                      key={i} 
                      onClick={() => { setSelectedPhoto(photo); setMode('edit'); }}
                      className="aspect-square rounded-3xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all group relative active-scale cursor-pointer shadow-lg"
                    >
                       <img src={photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                       <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}

        {mode === 'edit' && selectedPhoto && (
          <div className="flex-1 flex flex-col bg-slate-950 animate-in zoom-in duration-500">
             <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden bg-black/40">
                <img src={selectedPhoto} className="max-w-full max-h-[60vh] rounded-[2rem] shadow-2xl border border-white/5" alt="" />
                <button onClick={() => setMode('gallery')} className="absolute top-8 left-8 p-3 text-white/50 hover:text-white bg-white/5 rounded-full"><X size={20}/></button>
             </div>

             <div className="bg-slate-900 border-t border-white/5 p-8 space-y-8">
                <div className="flex items-center justify-between">
                   <div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">Neural_Refinement</h4>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">Apply Metadata Enhancements</p>
                   </div>
                   <div className="flex gap-3">
                      <EditBtn icon={<Download size={16}/>} label="Save" />
                      <EditBtn icon={<Share2 size={16}/>} label="Relay" />
                      <EditBtn icon={<Trash2 size={16}/>} label="Purge" color="text-red-500" />
                   </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scroll-hide">
                   <EditOption icon={<Aperture size={18}/>} label="Auto_Enhance" />
                   <EditOption icon={<Layers size={18}/>} label="Stack_Frames" />
                   <EditOption icon={<Zap size={18}/>} label="Neural_Pulse" />
                   <EditOption icon={<Eye size={18}/>} label="Lens_Correction" />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HeaderBtn = ({ icon, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl border transition-all active-scale ${active ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
  >
    {icon}
  </button>
);

const FilterIcon = ({ active, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 group active-scale`}
  >
     <div className={`w-12 h-12 rounded-2xl border transition-all ${active ? 'bg-indigo-600 border-indigo-400 shadow-lg scale-110' : 'bg-black/60 border-white/10 group-hover:border-white/30'}`} />
     <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-500'}`}>{label}</span>
  </button>
);

const SliderControl = ({ icon, val, setVal }: any) => (
  <div className="flex items-center gap-3">
    <div className="text-white/40">{icon}</div>
    <input 
      type="range" 
      min="50" 
      max="150" 
      value={val} 
      onChange={e => setVal(parseInt(e.target.value))}
      className="w-24 h-1 bg-white/10 rounded-full appearance-none accent-indigo-500 cursor-pointer"
    />
  </div>
);

const EditBtn = ({ icon, label, color }: any) => (
  <button className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active-scale ${color || 'text-slate-400 hover:text-white'}`}>
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const EditOption = ({ icon, label }: any) => (
  <button className="flex flex-col items-center gap-3 min-w-[100px] p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-indigo-500/30 transition-all active-scale group">
     <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
     <span className="text-[8px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest text-center">{label}</span>
  </button>
);

export default CameraApp;
