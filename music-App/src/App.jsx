import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

 

  return (
    
    <>
    <title>musicApp</title>
    <h1 className = "header">
      MusicPlayer v1.0
      
    </h1>
    <h2 className='subheader'>Here is a beta version of how it may look like</h2>
     <h1 className = 'MONGO'> Mongo Test Entries </h1>
    </>
  )
}

export default App
