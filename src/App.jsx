import Home from "./components/Home";

function App() {
  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between gap-4 p-4">
          <h1>
            Kyere<span className="text-blue-400">Mu</span>
          </h1>
          <button className="flex items-center gap-2">
            <p>New</p>
            <i class="fa-solid fa-plus"></i>
          </button>
        </header>
        <Home/>
      </section>
      <footer></footer>
    </div>
  );
}

export default App;
