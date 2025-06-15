import { useState } from 'react'
import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import { HexColorPicker } from "react-colorful";



const ColorWheel = ({ color, setColor }) => {
  return <div className="color-picker-wrapper">
  <HexColorPicker color={color} onChange={setColor} />
</div>
};

function getOppositeColor(hex) {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

  return luminance > 186 ? '#000000' : '#FFFFFF';
}


import './App.css'
function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}


function App() {

  // const [youtubeInput, setYoutubeInput] = useState('');
  const [color, setColor] = useState(() => {
    return localStorage.getItem("currentColor") || "#aabbcc";
  });  const[textColor, setTextColor]= useState("")
  const [videoId, setVideoId] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [songName,   setSongName]   = useState('');
const [artistName, setArtistName] = useState('');
const [allVideos, setAllVideos] = useState([]);

const [customLyrics, setCustomLyrics] = useState('False');
const [visibleLyrics, setVisibleLyrics] = useState({});
const [colorName,setColorName] = useState("");


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

  useEffect(() => {
    localStorage.setItem("currentColor", color);
    setTextColor(getOppositeColor(color));
    document.body.style.background = color;
  }, [color]);
  
  

  // assume at the top of your component you have:
// const [visibleLyrics, setVisibleLyrics] = useState({});

function toggleLyrics(id) {
  setVisibleLyrics(function(prev) {
    var newVisible = Object.assign({}, prev);

    
    if (newVisible[id]) {
      newVisible[id] = false;
    } else {
      newVisible[id] = true;
    }

    
    return newVisible;
  });
}

async function loadLyrics(artist, song) {
  try {
    const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (json.lyrics) {
      setLyrics(json.lyrics);
    } else {
      setLyrics('No lyrics found for this song. Please input your own');
    }
  } catch (err) {
    console.error('Lyrics.ovh error:', err);
    setLyrics('Error fetching lyrics. Please try again later.');
  }
}



  
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const userId = user?.sub;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  const [entries, setEntries] = useState([]);
  const deleteEntry = async (id) => {
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/journal/${id}`);
      url.searchParams.set('userId', user.sub);
  
      const res = await fetch(url.toString(), { method: 'DELETE' });

      const json = await res.json();
      if (json.success) {
        setEntries((prev) => prev.filter((e) => e._id !== id));
      } else {
        console.error('Delete failed:', json.error);
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  useEffect(() => {
    document.body.style.background = color;
  }, [color]);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const fetchEntries = async () => {
      try {
        const url = new URL(`${import.meta.env.VITE_API_URL}/api/journal`);
        url.searchParams.set("userId", userId);

        const res = await fetch(url.toString());

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        setEntries(data);
      } catch (err) {
        console.error("Error fetching entries:", err);
      }
    };

    fetchEntries();
  }, [isAuthenticated, userId]);
 

  
  const songEntry = async (e) => {
  e.preventDefault();
  const youtube = e.target[0].value;
  const song = e.target[1].value;
  const artist = e.target[2].value;
  const journal = e.target[5].value;
  const ahhLyrics = e.target[4].value;
  const colorName = e.target[3].value;
  


  if (song && journal) {
    const entry = {
      song: song,
      artist: artist,
      journal: journal,
      createdAt: new Date(),
      userId: user.sub,
      youtube: youtube,
      lyrics : ahhLyrics,
      colorName: colorName,
      color : color
    };


    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/journal`      , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const data = await response.json();
      console.log('Entry created with ID:', data.insertedId);
      e.target.reset(); 
      setLyrics('');  
      window.location.reload();
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  } else {
    alert('Please fill in all fields');
  }
}

  return (
    
    <div className='every' style={{ background: color,color: textColor }}>
    

    <title>musicApp</title>
    <h1 className = "header">
      MusicPlayer v1.1
      
    </h1>
    <h2 className='subheader' >Here is a beta version of how it may look like</h2>
     <h1 className = 'MONGO'> Mongo Test Entries </h1>
     <div>

     <div className='yourComponent'> 
        <h1> <ColorWheel color = {color} setColor={setColor} /></h1>
       
        
        




        </div>
    <form className='form' onSubmit={songEntry}>
      <label className='label'>YouTube Link </label>
      <input type="text" className='inputYoutube' name="youtube" placeholder="Enter YouTube video link" onChange={e => setVideoId(extractYouTubeId(e.target.value))} />
      <label className='label' >Song Name</label>
      <input type="text" className='inputSong' onChange={e => setSongName(e.target.value)}/>

      <label className='label'  >Artist Name</label>
      <input type="text" className='input Artist'onChange={e => setArtistName(e.target.value)} />
      <label className='color' >Background Color</label>
      <input type="text" className='backColor' onChange={e => setColorName(e.target.value)}/>

    <label className="label">Lyrics</label>
<textarea
  className="Lyrics"
  rows={6}
  value={lyrics}
  onChange={e => setLyrics(e.target.value)}
  placeholder="Lyrics will appear here…"
/>

      
      <label className='label'> Journal Thoughts</label>
      <textarea className="inputJournal" placeholder="Your thoughts..."></textarea>
      
      <button type="submit" className='button'>Create Song Entry</button>
          <button type = "button" onClick={() => {loadLyrics(artistName, songName)}}  className='button'>Get Lyrics</button>


    </form>
   

    </div>

   <div className="entry-list">
  {entries.length === 0 ? (
    <p>No entries yet.</p>
  ) : (
    [...entries].reverse().map(entry => {
     
      const vid = extractYouTubeId(entry.youtube);
      const ahh = entry.lyrics || 'No lyrics available';
  
const visible = visibleLyrics[entry._id] === true;

     

      return (
        
        <div key={entry._id} className="entry">
           <strong>Date:</strong>   {new Date(entry.createdAt).toLocaleString()}<br/>
          <strong>Song:</strong>   {entry.song}<br/>
          <strong>Artist:</strong> {entry.artist}<br/> 
          <strong> Background Color:</strong> {entry.colorName} <br/>

          
         

          <strong>Journal:</strong>
          <div className="journaling">{entry.journal}</div><br/>
         

          <button
            type="button"
            className="changeToMusic"
            onClick={() => toggleLyrics(entry._id)}
            
           
            
          >
        
            Show/Hide Lyrics
          </button>
          <button style={{ backgroundColor: entry.color }} type = "button"  onClick={() => setColor(entry.color)}> Change Color </button>
          <button
            type="button"
            className="deleteButton"
            onClick={() => deleteEntry(entry._id)}
          >
            Delete
          </button>

          {visible&&vid && (
            <iframe
              className="ahhhh"
              width="25%"
              height="25%"
              src={`https://www.youtube-nocookie.com/embed/${vid}`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}

          {visible && <pre className="lyricsAHHH" >{ahh}</pre>}
          <hr/>
        </div>
      );
    })
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
</div>
</div>

    
  )
  
}



export default App;
