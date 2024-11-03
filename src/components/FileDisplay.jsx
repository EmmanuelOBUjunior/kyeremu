
export default function FileDisplay({file, audioStream, handleAudioReset}) {
  return (
    <main className="flex-1 p-4 gap-3 sm:gap-4 md:gap-5 flex flex-col justify-center text-center pb-20">
        <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl">
        Your<span className="text-blue-400 bold"> File</span>
      </h1>
      <div className="flex items-center gap-2"></div>
    </main>
  )
}
