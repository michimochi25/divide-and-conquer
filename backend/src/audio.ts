import fetch from 'node-fetch';

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
    const apiKey = "AIzaSyCkill1F5-Qkr06Gt1v_oiNumZC_JYrxaI";
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
