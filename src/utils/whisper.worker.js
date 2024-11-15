import {pipeline, env} from "@xenova/transformers"
import { MessageTypes } from "./presets";


// Configure transformers.js to use local cache
// env.cacheDir = './models';
env.allowRemoteModels = true;  // Allow downloading models if not in cache
env.backends.onnx.wasm.wasmPaths = '/node_modules/@xenova/transformers/dist/';

class MyTranscriptionPipeline {
    static task = 'automatic-speech-recognition';
    static model = 'Xenova/whisper-tiny.en';  // Use Xenova's hosted model instead of OpenAI's
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            try {
                // Configure the pipeline
                const pipelineConfig = {
                    progress_callback,
                    revision: 'main',
                    quantized: true,
                };

                console.log('Starting pipeline initialization...');
                this.instance = await pipeline(this.task, this.model, pipelineConfig);
                console.log('Pipeline initialized successfully');
            } catch (error) {
                console.error('Detailed pipeline error:', error);
                throw new Error(`Model initialization failed: ${error.message}`);
            }
        }
        return this.instance;
    }
}

self.addEventListener("message", async (event) => {
  const { type, audio } = event.data;
  if (type === MessageTypes.INFERENCE_REQUEST) {
    await transcribe(audio);
  }
});

async function transcribe(audio) {
    try {
        sendLoadingMessage('loading');
        console.log('Starting transcription...');
        
        const pipeline = await MyTranscriptionPipeline.getInstance(load_model_callback);
        if (!pipeline) {
            throw new Error('Pipeline initialization failed');
        }

        sendLoadingMessage('success');
        console.log('Pipeline ready, processing audio...');

        const stride_length_s = 5;
        const generationTracker = new GenerationTracker(pipeline, stride_length_s);
        
        await pipeline(audio, {
            top_k: 0,
            do_sample: false,
            chunk_length: 30,
            stride_length_s,
            return_timestamps: true,
            callback_function: generationTracker.callbackFunction.bind(generationTracker),
            chunk_callback: generationTracker.chunkCallback.bind(generationTracker)
        });

        generationTracker.sendFinalResult();
    } catch (error) {
        console.error('Transcription error:', error);
        sendLoadingMessage('error', error.message);
    }
}

async function load_model_callback(data) {
    try {
        const { status } = data;
        if (status === 'progress') {
            const { file, progress, loaded, total } = data;
            console.log(`Downloading ${file}: ${progress}% (${loaded}/${total})`);
            sendDownloadingMessage(file, progress, loaded, total);
        }
    } catch (error) {
        console.error('Load model callback error:', error);
    }
}

function sendLoadingMessage(status, error = null) {
    self.postMessage({
        type: MessageTypes.LOADING,
        status,
        error
    });
}

async function sendDownloadingMessage(file, progress, loaded, total) {
    self.postMessage({
        type: MessageTypes.DOWNLOADING,
        file,
        progress,
        loaded,
        total
    });
}

class GenerationTracker {
  constructor(pipeline, stride_length_s) {
    if (!pipeline) {
      console.log("Pipeline is required to GenerationTracker");
    }
    this.pipeline = pipeline;
    this.stride_length_s = stride_length_s;
    this.chunks = [];
    //safe access to nested properties with fallbacks
    const chunk_length =
      pipeline.processor?.feature_extractor?.config?.chunk_length || 30;
    const max_source_positions =
      pipeline.model?.config?.max_source_positions || 1500;
    this.time_precision = chunk_length / max_source_positions;
    this.processed_chunks = [];
    this.callbackFunctionCounter = 0;
  }

  sendFinalResult() {
    self.postMessage({ type: MessageTypes.INFERENCE_DONE });
  }

  callbackFunction(beams) {
    if(!beams || !beams.length) return
    this.callbackFunctionCounter += 1;
    if (this.callbackFunctionCounter % 10 !== 0) {
      return;
    }

    const bestBeam = beams[0];
    let text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
      skip_special_tokens: true,
    });

    const result = {
      text,
      start: this.getLastChunkTimestamp(),
      end: undefined,
    };

    createPartialResultMessage(result);
  }

  chunkCallback(data) {
    this.chunks.push(data);
    const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(
      this.chunks,
      {
        time_precision: this.time_precision,
        return_timestamps: true,
        force_full_sequence: false,
      }
    );

    this.processed_chunks = chunks.map((chunk, index) => {
      return this.processChunk(chunk, index);
    });

    createResultMessage(
      this.processed_chunks,
      false,
      this.getLastChunkTimestamp()
    );
  }

  getLastChunkTimestamp() {
    if (this.processed_chunks.length === 0) {
      return 0;
    }
  }

  processChunk(chunk, index) {
    const { text, timestamp } = chunk;
    const [start, end] = timestamp;

    return {
      index,
      text: `${text.trim()}`,
      start: Math.round(start),
      end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s),
    };
  }
}

function createResultMessage(results, isDone, completedUntilTimestamp) {
  self.postMessage({
    type: MessageTypes.RESULT,
    results,
    isDone,
    completedUntilTimestamp,
  });
}

function createPartialResultMessage(result) {
  self.postMessage({
    type: MessageTypes.RESULT_PARTIAL,
    result,
  });
}

