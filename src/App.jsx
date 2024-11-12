import { useEffect, useRef, useState } from "react";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Nav from "./components/Nav";
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import Transcribing from "./components/Transcribing";

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [finished, setFinished] = useState(false);
  const worker = useRef(null);
  const isAudioAvailable = file || audioStream;

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./utils/whisper.worker.js"),
        import.meta.url,
        { type: "module" }
      );
    }

    const onMessageReceived = async (e) =>{
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true)
          console.log("DOWNLOADING")
          break;
        case 'LOADING':
          setLoading(true)
          break;
        case 'RESULT':
          setOutput(e.data.results)
        case 'INFERENCE_DONE':
          setFinished(true)
          break;
      }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current.removeEventListner('message', onMessageReceived)

  }, []);

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  async function readAudiofrom(file) {
    
  }

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Nav />
        {output ? (
          <Information />
        ) : loading ? (
          <Transcribing />
        ) : isAudioAvailable ? (
          <FileDisplay
            handleAudioReset={handleAudioReset}
            file={file}
            audioStream={audioStream}
          />
        ) : (
          <Home setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <Footer />
    </div>
  );
}

export default App;
