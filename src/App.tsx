import SlotMachine from './components/SlotMachine'
import Background from './components/Background'
import './App.css'

function App() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <Background />
      <div className="relative z-10">
        <SlotMachine />
      </div>
    </div>
  )
}

export default App