import { useState } from "react"

export default function Information() {
    const [tab, setTab] = useState('transcription')
  return (
    <main className="flex-1 p-4 gap-3 sm:gap-4 md:gap-5 flex flex-col justify-center text-center pb-20 mx-auto w-full max-w-prose">
      <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl whitespace-nowrap">
        Your<span className="text-blue-400 bold"> Transcription</span>
      </h1>
        <div className="flex mx-auto bg-white  shadow rounded-full overflow-hidden items center gap-2">
            <button className={"px-4 py-1 font-medium "+ (tab === 'transcription' ? 'bg-blue-500 text-white' : ' text-blue-400 hover:text-blue-600')}>Transcription</button>
            <button className={"px-4 py-1 font-medium" + (tab === 'translation' ? ' bg-blue-500 text-white': ' text-blue-400 hover:text-blue-600')}>Translation</button>
        </div>
      </main>
  )
}
