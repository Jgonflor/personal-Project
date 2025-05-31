import { useState } from 'react'
import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import './App.css'
function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}


function App() {

  // const [youtubeInput, setYoutubeInput] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [lyrics, setLyrics] = useState(null);

    const handleYoutube= async (e) => {
    e.preventDefault();
    const url = e.target.youtube.value;
    const id = extractYouTubeId(url);
    if (id) {
      setVideoId(id);
      console.log('YouTube ID:', id);
    } else {
      alert('Invalid YouTube URL');
    }

    setVideos(prev => [...prev, { id }]);
    e.target.reset();
  
  }

   const loadLyrics = async (artist,song) => {
    
    try {
      const response = await fetch(
        `https://api.lyrics.ovh/v1/${artist}/${song}`
      );
      const data = await response.json();
      if (data.lyrics) {
        setLyrics(data.lyrics);
        console.log('Lyrics:', data.lyrics);
      } else {
        setError('Lyrics not found');
      }
    } catch (e) {
      console.error(e);
      setError('Error fetching lyrics');
    }
  };



  
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const fetchEntries = async () => {
      try {
       const response = await fetch('http://localhost:3001/api/journal');
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    fetchEntries();
  }, []);
 

  
  const songEntry = async (e) => {
  e.preventDefault();
  const youtube = e.target[0].value;
  const song = e.target[1].value;
  const artist = e.target[2].value;
  const journal = e.target[3].value;
  


  if (song && journal) {
    const entry = {
      song: song,
      artist: artist,
      journal: journal,
      createdAt: new Date(),
      email: user?.email,
      youtube: youtube
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
      MusicPlayer v1.1
      
    </h1>
    <h2 className='subheader'>Here is a beta version of how it may look like</h2>
     <h1 className = 'MONGO'> Mongo Test Entries </h1>
     <div>

    
    <form className='form' onSubmit={songEntry}>
      <label className='label'>YouTube Link </label>
      <input type="text" className='inputYoutube' name="youtube" placeholder="Enter YouTube video link" onChange={e => setVideoId(extractYouTubeId(e.target.value))} />
      <label className='label'>Song Name</label>
      <input type="text" className='inputSong' />

      <label className='label'>Artist Name</label>
      <input type="text" className='input Artist' />
      
      <label className='label'> Journal Thoughts</label>
      <textarea className="inputJournal" placeholder="Your thoughts..."></textarea>
      <button type="submit" className='button'>Create Song Entry</button>
    </form>

   

    <button className='getEntries' onClick={() => window.location.reload()}> get Entries</button>
    </div>

    <div className="entry-list">
      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        [...entries].reverse().map((entry) => (
          <div key={entry._id} className="entry">
            <strong>Song:</strong> {entry.song} <br />
            <strong>Artist:</strong> {entry.artist} <br />
            <strong >Journal:</strong> <div className='journaling'>{entry.journal} </div><br />
            <strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}<br />
            <button className='changeToMusic' onClick={() => (setVideoId(extractYouTubeId(entry.youtube)),loadLyrics(entry.artist,entry.song))}>video and lyrics</button>



            
            <hr />
          </div>
        ))
      )}
    </div>

     {/* <form className='youtube' onSubmit={handleYoutube}>
      <label className='label'>YouTube Video ID</label>
      <input type="text" className='inputYoutube' name="youtube" placeholder="Enter YouTube video link" />
      <button type="submit" className='button'>Add YouTube Video</button>
    </form> */}

   {videoId && (
  <iframe
    className='video'
    width="50%"
    height="50%"
    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
    allow="autoplay; encrypted-media"
    allowFullScreen
  ></iframe>
)}
<div className='lyricsContainer'>
<pre className='lyrics'>{lyrics}</pre>
</div>


    </>
  )
}



export default App;
