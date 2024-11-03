import Footer from "./components/Footer";
import Home from "./components/Home";
import Nav from "./components/Nav";

function App() {
  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
       <Nav/>
        <Home/>
      </section>
      <Footer/>
    </div>
  );
}

export default App;
