// import { pipeline } from "@xenova/transformers";
// import { MessageTypes } from "./presets";

// class MyTranscriptionPipeline {
//   static task = "automatic-speech-recognition";
//   static model = "openai/whisper-tiny.en";
//   static instance = null;

//   static async getInstance(progress_callback = null) {
//     if (this.instance === null) {
//       this.instance = await pipeline(this.task, this.model, {
//         progress_callback,
//       });
//     }

//     return this.instance;
//   }
// }

// self.addEventListener("message", async (event) => {
//   const { type, audio } = event.data;
//   if (type === MessageTypes.INFERENCE_REQUEST) {
//     await transcribe(audio);
//   }
// });

// async function transcribe(audio) {
//   sendLoadingMessage("loading");

//   let pipeline;

//   try {
//     pipeline = await MyTranscriptionPipeline.getInstance(load_model_callback);
//     if (!pipeline) {
//       console.log("Failed to initialize pipeline");
//       return;
//     }
//   } catch (err) {
//     console.error("Pipeline initialization error: ", err);
//     return;
//   }

//   sendLoadingMessage("success");

//   const stride_length_s = 5;

//   try {
//     const generationTracker = new GenerationTracker(pipeline, stride_length_s);
//     await pipeline(audio, {
//       top_k: 0,
//       do_sample: false,
//       chunk_length: 30,
//       stride_length_s,
//       return_timestamps: true,
//       callback_function:
//         generationTracker.callbackFunction.bind(generationTracker),
//       chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
//     });
//     generationTracker.sendFinalResult();
//   } catch (err) {
//     console.error("Transcription Error: ", err);
//   }
// }

// async function load_model_callback(data) {
//   const { status } = data;
//   if (status === "progress") {
//     const { file, progress, loaded, total } = data;
//     sendDownloadingMessage(file, progress, loaded, total);
//   }
// }

// function sendLoadingMessage(status) {
//   self.postMessage({
//     type: MessageTypes.LOADING,
//     status,
//   });
// }

// async function sendDownloadingMessage(file, progress, loaded, total) {
//   self.postMessage({
//     type: MessageTypes.DOWNLOADING,
//     file,
//     progress,
//     loaded,
//     total,
//   });
// }

// class GenerationTracker {
//   constructor(pipeline, stride_length_s) {
//     if (!pipeline) {
//       console.log("Pipeline is required to GenerationTracker");
//     }
//     this.pipeline = pipeline;
//     this.stride_length_s = stride_length_s;
//     this.chunks = [];
//     //safe access to nested properties with fallbacks
//     const chunk_length =
//       pipeline.processor?.feature_extractor?.config?.chunk_length || 30;
//     const max_source_positions =
//       pipeline.model?.config?.max_source_positions || 1500;
//     this.time_precision = chunk_length / max_source_positions;
//     this.processed_chunks = [];
//     this.callbackFunctionCounter = 0;
//   }

//   sendFinalResult() {
//     self.postMessage({ type: MessageTypes.INFERENCE_DONE });
//   }

//   callbackFunction(beams) {
//     if(!beams || !beams.length) return
//     this.callbackFunctionCounter += 1;
//     if (this.callbackFunctionCounter % 10 !== 0) {
//       return;
//     }

//     const bestBeam = beams[0];
//     let text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
//       skip_special_tokens: true,
//     });

//     const result = {
//       text,
//       start: this.getLastChunkTimestamp(),
//       end: undefined,
//     };

//     createPartialResultMessage(result);
//   }

//   chunkCallback(data) {
//     this.chunks.push(data);
//     const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(
//       this.chunks,
//       {
//         time_precision: this.time_precision,
//         return_timestamps: true,
//         force_full_sequence: false,
//       }
//     );

//     this.processed_chunks = chunks.map((chunk, index) => {
//       return this.processChunk(chunk, index);
//     });

//     createResultMessage(
//       this.processed_chunks,
//       false,
//       this.getLastChunkTimestamp()
//     );
//   }

//   getLastChunkTimestamp() {
//     if (this.processed_chunks.length === 0) {
//       return 0;
//     }
//   }

//   processChunk(chunk, index) {
//     const { text, timestamp } = chunk;
//     const [start, end] = timestamp;

//     return {
//       index,
//       text: `${text.trim()}`,
//       start: Math.round(start),
//       end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s),
//     };
//   }
// }

// function createResultMessage(results, isDone, completedUntilTimestamp) {
//   self.postMessage({
//     type: MessageTypes.RESULT,
//     results,
//     isDone,
//     completedUntilTimestamp,
//   });
// }

// function createPartialResultMessage(result) {
//   self.postMessage({
//     type: MessageTypes.RESULT_PARTIAL,
//     result,
//   });
// }


/* eslint-disable camelcase */
import { pipeline, env } from "@xenova/transformers";

// Disable local models
env.allowLocalModels = false;

// Define model factories
// Ensures only one model is created of each type
class PipelineFactory {
    static task = null;
    static model = null;
    static quantized = null;
    static instance = null;

    constructor(tokenizer, model, quantized) {
        this.tokenizer = tokenizer;
        this.model = model;
        this.quantized = quantized;
    }

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, {
                quantized: this.quantized,
                progress_callback,

                // For medium models, we need to load the `no_attentions` revision to avoid running out of memory
                revision: this.model.includes("/whisper-medium") ? "no_attentions" : "main"
            });
        }

        return this.instance;
    }
}

self.addEventListener("message", async (event) => {
    const message = event.data;

    // Do some work...
    // TODO use message data
    let transcript = await transcribe(
        message.audio,
        message.model,
        message.multilingual,
        message.quantized,
        message.subtask,
        message.language,
    );
    if (transcript === null) return;

    // Send the result back to the main thread
    self.postMessage({
        status: "complete",
        task: "automatic-speech-recognition",
        data: transcript,
    });
});

class AutomaticSpeechRecognitionPipelineFactory extends PipelineFactory {
    static task = "automatic-speech-recognition";
    static model = null;
    static quantized = null;
}

const transcribe = async (
    audio,
    model,
    multilingual,
    quantized,
    subtask,
    language,
) => {

    const isDistilWhisper = model.startsWith("distil-whisper/");

    let modelName = model;
    if (!isDistilWhisper && !multilingual) {
        modelName += ".en"
    }

    const p = AutomaticSpeechRecognitionPipelineFactory;
    if (p.model !== modelName || p.quantized !== quantized) {
        // Invalidate model if different
        p.model = modelName;
        p.quantized = quantized;

        if (p.instance !== null) {
            (await p.getInstance()).dispose();
            p.instance = null;
        }
    }

    // Load transcriber model
    let transcriber = await p.getInstance((data) => {
        self.postMessage(data);
    });

    const time_precision =
        transcriber.processor.feature_extractor.config.chunk_length /
        transcriber.model.config.max_source_positions;

    // Storage for chunks to be processed. Initialise with an empty chunk.
    let chunks_to_process = [
        {
            tokens: [],
            finalised: false,
        },
    ];

    // TODO: Storage for fully-processed and merged chunks
    // let decoded_chunks = [];

    function chunk_callback(chunk) {
        let last = chunks_to_process[chunks_to_process.length - 1];

        // Overwrite last chunk with new info
        Object.assign(last, chunk);
        last.finalised = true;

        // Create an empty chunk after, if it not the last chunk
        if (!chunk.is_last) {
            chunks_to_process.push({
                tokens: [],
                finalised: false,
            });
        }
    }

    // Inject custom callback function to handle merging of chunks
    function callback_function(item) {
        let last = chunks_to_process[chunks_to_process.length - 1];

        // Update tokens of last chunk
        last.tokens = [...item[0].output_token_ids];

        // Merge text chunks
        // TODO optimise so we don't have to decode all chunks every time
        let data = transcriber.tokenizer._decode_asr(chunks_to_process, {
            time_precision: time_precision,
            return_timestamps: true,
            force_full_sequences: false,
        });

        self.postMessage({
            status: "update",
            task: "automatic-speech-recognition",
            data: data,
        });
    }

    // Actually run transcription
    let output = await transcriber(audio, {
        // Greedy
        top_k: 0,
        do_sample: false,

        // Sliding window
        chunk_length_s: isDistilWhisper ? 20 : 30,
        stride_length_s: isDistilWhisper ? 3 : 5,

        // Language and task
        language: language,
        task: subtask,

        // Return timestamps
        return_timestamps: true,
        force_full_sequences: false,

        // Callback functions
        callback_function: callback_function, // after each generation step
        chunk_callback: chunk_callback, // after each chunk is processed
    }).catch((error) => {
        self.postMessage({
            status: "error",
            task: "automatic-speech-recognition",
            data: error,
        });
        return null;
    });

    return output;
};