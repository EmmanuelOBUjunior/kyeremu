
export default function Nav() {
  return (
    <nav className="flex items-center justify-between gap-4 p-4">
    <h1 className="font-medium">
      Kyere<span className="text-blue-400 bold">Mu</span>
    </h1>
    <button className="flex items-center gap-2">
      <p>New</p>
      <i class="fa-solid fa-plus"></i>
    </button>
  </nav>
  )
}
