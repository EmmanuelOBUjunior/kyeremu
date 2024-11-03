import { useState } from "react";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Nav from "./components/Nav";
import FileDisplay from "./components/FileDisplay";

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const isAvailable = file || audioStream;
  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Nav />
        {isAvailable ? (
          <FileDisplay />
        ) : (
          <Home setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <Footer />
    </div>
  );
}

export default App;
