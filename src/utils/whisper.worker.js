import { pipeline } from "@xenova/transformers";


class MyTranscriptionPipeline{
    static task = 'automatic-speech-recognition'
    static model = 'openai/whisper-tiny.en'
    static instance = null
}