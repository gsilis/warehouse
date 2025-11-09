import './App.css'
import { Controls } from './Controls'
import { Viewer } from './Viewer'

function App() {
  return (
    <div className="flex flex-row h-screen">
      <Viewer/>
      <Controls />
    </div>
  )
}

export default App
