import { pipeline } from "@xenova/transformers";
import { MessageTypes } from "./presets";

class MyTranscriptionPipeline {
  static task = "automatic-speech-recognition";
  static model = "openai/whisper-tiny.en";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, null, { progress_callback });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (e) => {
  const { type, audio } = e.data;
  if (type === MessageTypes.INFERENCE_REQUEST) await transcribe(audio);
});

async function transcribe(audio) {
  sendLoadingMessage("loading");
  let pipeline;
  try {
    pipeline = await MyTranscriptionPipeline.getInstance(load_model_callback);
  } catch (err) {
    console.log(err.message);
  }

  sendLoadingMessage("success");

  const stride_length_s = 5;

  const generationTracker = new GenerationTraker(pipeline, stride_length_s);
  await pipeline(audio, {
    top_k: 0,
    do_sample: false,
    chunk_length: 30,
    stride_length_s,
    return_timestamps: true
  });
}
