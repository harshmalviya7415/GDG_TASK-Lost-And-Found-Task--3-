import Navbar from "./components/Navbar"
import Button from "./components/Button"

function App() {
  const navLinks = [

    { label: "Lost", href: "#about" },
    { label: "Found", href: "#features" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar brandName="Foundly" links={navLinks} theme="dark" />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Welcome to Foundly
        </h1>
        <p className="text-gray-400 text-lg max-w-md text-center">
          Building state of the art web interfaces using modern, clean components.
        </p>
        <div className="flex gap-4">
          <Button name="Get Started" theme="dark" />
          <Button name="Learn More" theme="light" />
        </div>
      </div>
    </div>
  )
}

export default App