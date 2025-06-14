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
  const [videoId, setVideoId] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [songName,   setSongName]   = useState('');
const [artistName, setArtistName] = useState('');
const [allVideos, setAllVideos] = useState([]);

const [customLyrics, setCustomLyrics] = useState('False');
const [visibleLyrics, setVisibleLyrics] = useState({});


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
      const apiUrl   = `https://api.vagalume.com.br/v1/lyrics/`
                   + `${encodeURIComponent(artist)}/`
                   + `${encodeURIComponent(song)}`;
  const proxyUrl = `https://corsproxy.io/?` 
                   + `url=${encodeURIComponent(apiUrl)}`;

    const res  = await fetch(proxyUrl
    );
    const json = await res.json();
    // { artist: "...", song: "...", lyrics: "Full lyric text..." }
    if (json.lyrics) {
      setLyrics(json.lyrics);
    } else {
      setLyrics('No lyrics found for this song.');
    }
  } catch (err) {
    console.error('Vagalume error', err);
    setLyrics('Error fetching lyrics. Please try again later.');
  }
}

//    const loadLyrics = async (artist,song) => {
    
//     try {
//       const response = await fetch(
//         `https://www.theaudiodb.com/api/v1/json/2/searchtrack.php?s=${encodeURIComponent(artist)}&t=${encodeURIComponent(song)}`
//       );
//       const data = await response.json();
//       const fetched = data.track?.[0]?.strLyrics;
//       if (fetched) {
// +       setLyrics(fetched);
// +       console.log('🎵 Lyrics:', fetched)
//       }
//     else {
//         // setError('Lyrics not found');
//         customLyrics === 'False' ? setCustomLyrics('True') : setCustomLyrics('False');
//         console.log(data.track?.[0]?.strLyrics);
//         setLyrics('No lyrics found for this song.');
//       }
//     } catch (e) {
//       console.error(e);
//       customLyrics === 'False' ? setCustomLyrics('True') : setCustomLyrics('False');
//         setLyrics('No lyrics found for this song.');
//       setError('Error fetching lyrics');
//     }
//   };



  
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  const [entries, setEntries] = useState([]);
  const deleteEntry = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/journal/${id}`, {
        method: 'DELETE'
      });
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
  const journal = e.target[4].value;
  const ahhLyrics = e.target[3].value;
  


  if (song && journal) {
    const entry = {
      song: song,
      artist: artist,
      journal: journal,
      createdAt: new Date(),
      email: user?.email,
      youtube: youtube,
      lyrics : ahhLyrics
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
      <label className='label' >Song Name</label>
      <input type="text" className='inputSong' onChange={e => setSongName(e.target.value)}/>

      <label className='label'  >Artist Name</label>
      <input type="text" className='input Artist'onChange={e => setArtistName(e.target.value)} />

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
          <button type = "button" onClick={() => loadLyrics(artistName, songName)}  className='button'>Get Lyrics</button>

    </form>
   

    <button className='getEntries' onClick={() => window.location.reload()}> get Entries</button>
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
          <strong>Song:</strong>   {entry.song}<br/>
          <strong>Artist:</strong> {entry.artist}<br/>
          <strong>Journal:</strong>
          <div className="journaling">{entry.journal}</div><br/>
          <strong>Date:</strong>   {new Date(entry.createdAt).toLocaleString()}<br/>

          <button
            type="button"
            className="changeToMusic"
            onClick={() => toggleLyrics(entry._id)}
            
           
            
          >
            Show/Hide Lyrics
          </button>
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
<pre className='lyrics'>{lyrics}</pre>
</div>


    </>
  )
}



export default App;
