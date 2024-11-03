function App() {
  return (
    <div className="flex flex-col p-4 max-w-[1000px]">
      <section className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between gap-4">
          <h1>
            Kyere<span className="text-blue-400">Mu</span>
          </h1>
          <button className="flex items-center gap-2">
            <p>New</p>
            <i class="fa-solid fa-plus"></i>
          </button>
        </header>
        <main className="flex-1"></main>
      </section>
      <footer></footer>
    </div>
  );
}

export default App;
