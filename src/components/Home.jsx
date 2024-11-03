import React from "react";

export default function Home() {
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
      <button className="flex items-center text-base justify-between gap-4 mx-auto max-w-full w-72 my-4">
        <p>Record</p>
        <i class="fa-solid fa-microphone"></i>
      </button>
      <p>Or <label className="text-blue cursor-pointer hoverr-text-blule-600">upload</label></p>
    </main>
  );
}
