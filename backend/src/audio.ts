import fetch from 'node-fetch';
import { spawn } from 'child_process';

interface GeminiTtsResponse {
    candidates: {
        content: {
            parts: {
                inlineData: {
                    data: string;
                };
            }[];
        };
    }[];
}

export async function genSpeech(text: string): Promise<string> {
    const model = "gemini-2.5-flash-preview-tts";
    const apiKey = "AIzaSyDcsDlMebamNJp3h9KGGP6ECLYS7DArxgY";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const textWithInstructions = `TTS the following conversation between Joe and Jane: ${text}`;

    const payload = {
        contents: [{
            parts: [{
                text: textWithInstructions
            }]
        }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: [{
                        speaker: "Joe",
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: "Algenib"
                            }
                        }
                    }, {
                        speaker: "Jane",
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: "Sulafat"
                            }
                        }
                    }]
                }
            },
        },
        model: model,
    };

    try {
        console.log("[TTS Service] Sending request to Google Gemini API...");
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            throw new Error(`API request failed with status ${apiResponse.status}: ${errorBody}`);
        }

        const result = (await apiResponse.json()) as GeminiTtsResponse;

        const audioData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioData) {
            console.error("[TTS Service] Unexpected API response structure:", result);
            throw new Error("The AI returned an empty or invalid audio response.");
        }

        console.log("[TTS Service] Successfully received audio data from API.");
        return audioData;

    } catch (error) {
        console.error("[TTS Service] Error generating speech:", error);
        throw error;
    }
}

function convertPcmToWav(pcmBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-f', 's16le',
            '-ar', '24000',
            '-ac', '1',
            '-i', 'pipe:0',
            '-f', 'wav',
            'pipe:1'
        ]);

        const wavChunks: Buffer[] = [];

        ffmpeg.stdout.on('data', (chunk) => {
            wavChunks.push(chunk);
        });

        ffmpeg.stderr.on('data', (data) => {
            console.error(`[ffmpeg stderr]: ${data}`);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                resolve(Buffer.concat(wavChunks));
            } else {
                reject(new Error(`ffmpeg process exited with code ${code}`));
            }
        });

        ffmpeg.on('error', (err) => {
            reject(new Error(`Failed to start ffmpeg process: ${err.message}`));
        });

        ffmpeg.stdin.write(pcmBuffer);
        ffmpeg.stdin.end();
    });
}

export async function generateWavAudio(text: string): Promise<Buffer> {
    const base64Audio = await genSpeech(text);
    const pcmBuffer = Buffer.from(base64Audio, 'base64');
    const wavBuffer = await convertPcmToWav(pcmBuffer);
    return wavBuffer;
}