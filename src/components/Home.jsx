import React, { useRef, useState } from "react";

export default function Home({ setFile, setAudioStream }) {
    const [recordingStatus, setRecordingStatus] = useState('inactive') 
    const [audioChunks, setAudioChunks] = useState([]) 
    const [duration, setDuration] = useState(0) 
    const mediaRecoder = useRef(null)
    const mimeType = 'audio/webm'


    async function startRecording() {
        let tempStream
        console.log("Start Recording")
        try {
          const streamData = navigator.mediaDevices.getUserMedia({
            audio:true,
            video: false
          })
          tempStream = streamData
        } catch (error) {
          console.log(err.message)
          return
        }
        setRecordingStatus("recording")

        //create new media recorder instance using the stream
        const media = new MediaRecorder(tempStream, {type:mimeType})
        mediaRecoder.current = media

        mediaRecoder.current.start()
        let localAudioChunks = []
        mediaRecoder.current.ondataavailable = (event)=>{
          if(typeof event.data === "undefined") return
          if (event.data.size === 0) return
          localAudioChunks.push(event.data)
        }
        setAudioChunks(localAudioChunks)
    }

    async function stopRecording() {
      setRecordingStatus("inactive")
      console.log("Stop recording")
    }

  return (
    <main className="flex-1 p-4 gap-3 sm:gap-4 md:gap-5 flex flex-col justify-center text-center pb-20">
      <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl">
        Kyere<span className="text-blue-400 bold">Mu</span>
      </h1>
      <h3 className="font-medium md:text-lg">
        Record{" "}
        <span className="text-blue-400 mx-1">
          <i class="fa-solid fa-arrow-right"></i>
        </span>{" "}
        Transcribe{" "}
        <span className="text-blue-400 mx-1">
          <i class="fa-solid fa-arrow-right"></i>
        </span>{" "}
        Translate
      </h3>
      <button className="specialBtn px-4 py-2 rounded-xl flex items-center text-base justify-between gap-4 mx-auto max-w-full w-72 my-4">
        <p className="text-blue-400">Record</p>
        <i className="fa-solid fa-microphone"></i>
      </button>
      <p className="text-base">
        Or{" "}
        <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">
          upload
          <input type="file" accept=".mp3,.wave" className="hidden" onChange={(e)=>{setFile(e.target.files[0])}}/>
        </label>{" "}
        a mp3 file
      </p>
      <p className="text-slate-400 italic">Free Now...Free Forever</p>
    </main>
  );
}
