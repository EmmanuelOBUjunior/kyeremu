export default function FileDisplay({ file, audioStream, handleAudioReset, handleFormSubmission }) {
  console.log("File:", file, audioStream);
  return (
    <main className="flex-1 p-4 gap-3 sm:gap-4 md:gap-5 flex flex-col justify-center text-center pb-20 w-72 sm:w-96 mx-auto max-w-full">
      <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl">
        Your<span className="text-blue-400 bold"> File</span>
      </h1>
      <div className="flex text-left flex-col my-4">
        <h3 className="font-semibold">Name</h3>
        <p>{file ? file?.name : "Custom Audio"}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          className="text-slate-400 hover:text-blue-500 duration-200"
          onClick={handleAudioReset}
        >
          Reset
        </button>
        <button onClick={handleFormSubmission} className="specialBtn py-2 px-3 flex items-center gap-2 font-medium rounded-lg text-blue-400">
          <p>Transcribe</p>
          <i className="fa-solid fa-pen-nib"></i>
        </button>
      </div>
    </main>
  );
}
