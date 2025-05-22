import { useState } from 'react'
import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import './App.css'

function App() {

  
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);
 
  const songEntry = async (e) => {
  e.preventDefault();
  const song = e.target[0].value;
  const journal = e.target[1].value;

  if (song && journal) {
    const entry = {
      song: song,
      journal: journal,
      createdAt: new Date(),
      email: user?.email,
    };

    try {
      const response = await fetch('http://localhost:3001/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const data = await response.json();
      console.log('Entry created with ID:', data.insertedId);
      e.target.reset(); 
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  } else {
    alert('Please fill in all fields');
  }
}

  return (
    
    <>
    <title>musicApp</title>
    <h1 className = "header">
      MusicPlayer v1.0
      
    </h1>
    <h2 className='subheader'>Here is a beta version of how it may look like</h2>
     <h1 className = 'MONGO'> Mongo Test Entries </h1>
    <form className='form' onSubmit={songEntry}>
      <label className='label'>Song Entry</label>
      <input type="text" className='inputSong' />
      <label className='label'> Journal Thoughts</label>
      <textarea className="inputJournal" placeholder="Your thoughts..."></textarea>
      <button type="submit" className='button'>Create Song Entry</button>
    </form>
    </>
  )
}



export default App;
