import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import type { Language } from '../App';
import { useAuth } from '../contexts/AuthContext';
import LockedContent from './common/LockedContent';
import Card from './common/Card';
import Button from './common/Button';
import { MicIcon, XIcon } from './icons';

interface LiveSession {
  sendRealtimeInput(input: { media: Blob }): void;
  close(): void;
}

const API_KEY = process.env.API_KEY;

// --- Audio Helper Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const translations = {
    en: {
        title: "Live AI Coach",
        start: "Start Live Session",
        stop: "End Session",
        status: {
            idle: "Press Start to begin your live coaching session.",
            connecting: "Connecting to AI Coach...",
            listening: "Listening... Start your exercise.",
            speaking: "Coach is speaking...",
            error: "Connection error. Please try again.",
            closed: "Session ended."
        },
        transcription: "Live Transcription"
    },
    ar: {
        title: "المدرب الذكي المباشر",
        start: "بدء الجلسة المباشرة",
        stop: "إنهاء الجلسة",
        status: {
            idle: "اضغط على 'بدء' لبدء جلسة التدريب المباشرة.",
            connecting: "جاري الاتصال بالمدرب الذكي...",
            listening: "أستمع الآن... ابدأ تمرينك.",
            speaking: "المدرب يتحدث...",
            error: "خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
            closed: "انتهت الجلسة."
        },
        transcription: "النص المباشر"
    }
};

const LiveWorkoutCoach: React.FC<{ language: Language }> = ({ language }) => {
    const { exerciseName } = useParams<{ exerciseName: string }>();
    const t = translations[language];
    const { subscriptionStatus } = useAuth();
    
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error' | 'closed'>('idle');
    const [transcription, setTranscription] = useState<{ user: string, model: string }[]>([]);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const audioContextRefs = useRef<{ input: AudioContext | null, output: AudioContext | null, sources: Set<AudioBufferSourceNode> }>({ input: null, output: null, sources: new Set() });
    const nextStartTimeRef = useRef(0);

    const startSession = async () => {
        if (!API_KEY) {
            setStatus('error');
            return;
        }

        setStatus('connecting');

        const ai = new GoogleGenAI({ apiKey: API_KEY });
        audioContextRefs.current.output = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = audioContextRefs.current.output.createGain();
        outputNode.connect(audioContextRefs.current.output.destination);

        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: async () => {
                    setStatus('listening');
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        audioContextRefs.current.input = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        const source = audioContextRefs.current.input.createMediaStreamSource(stream);
                        const scriptProcessor = audioContextRefs.current.input.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRefs.current.input.destination);
                    } catch (err) {
                         setStatus('error');
                    }
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio && audioContextRefs.current.output) {
                        setStatus('speaking');
                        const outputCtx = audioContextRefs.current.output;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputNode);
                        source.addEventListener('ended', () => {
                            audioContextRefs.current.sources.delete(source);
                            if (audioContextRefs.current.sources.size === 0) {
                                setStatus('listening');
                            }
                        });
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        audioContextRefs.current.sources.add(source);
                    }
                    if(message.serverContent?.interrupted){
                        audioContextRefs.current.sources.forEach(s => s.stop());
                        audioContextRefs.current.sources.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onerror: (e: ErrorEvent) => {
                    
                    setStatus('error');
                },
                onclose: () => {
                    setStatus('closed');
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                systemInstruction: `You are a world-class personal trainer, and you are live with a user. Your goal is to guide them through a workout of ${exerciseName}. Count their reps out loud, provide constant motivation like "You got this!" or "Great form!", and keep the energy high. Respond only with your voice.`,
            },
        });
    };
    
    const stopSession = () => {
        sessionPromiseRef.current?.then(session => session.close());
        audioContextRefs.current.input?.close();
        audioContextRefs.current.output?.close();
        
        // Clean up any playing audio sources
        audioContextRefs.current.sources.forEach(s => s.stop());
        audioContextRefs.current.sources.clear();
        nextStartTimeRef.current = 0;

        setStatus('closed');
    };

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            stopSession();
        };
    }, []);

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <Card>
            <h1 className="text-3xl font-bold text-center mb-2">{t.title}</h1>
            <p className="text-center text-gray-500 mb-6">Exercise: <span className="font-semibold text-primary">{exerciseName}</span></p>

            <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-8 min-h-[300px]">
                <MicIcon className={`w-24 h-24 mb-4 transition-colors ${status === 'listening' || status === 'speaking' ? 'text-primary animate-pulse' : 'text-gray-400'}`} />
                <p className="text-xl font-semibold text-center">{t.status[status]}</p>
            </div>
            
            <div className="mt-6 flex justify-center">
                {status === 'idle' || status === 'closed' || status === 'error' ? (
                     <Button onClick={startSession}>{t.start}</Button>
                ) : (
                     <Button onClick={stopSession} className="!bg-red-600 hover:!bg-red-700">{t.stop}</Button>
                )}
            </div>
        </Card>
    );
};

export default LiveWorkoutCoach;