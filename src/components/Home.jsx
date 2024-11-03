import React from "react";

export default function Home() {
  return (
    <main className="flex-1 p-4 gap-3 sm:gap-4 md:gap-5 flex flex-col justify-center">
      <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl">
        Kyere<span className="text-blue-400 bold">Mu</span>
      </h1>
      <h3>
        Record <span>&rarr;</span> Transcribe <span>&rarr;</span> Translate
      </h3>
    </main>
  );
}
