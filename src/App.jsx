import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Nav from "./components/Nav";
import FileDisplay from "./components/FileDisplay";

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }
  const isAvailable = file || audioStream;

  useEffect(() => {
    console.log(audioStream);
  }, [audioStream]);

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Nav />
        {isAvailable ? (
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
