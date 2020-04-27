import React, { useState, useEffect } from 'react';
import './App.css';
import ReactTwitchEmbedVideo from "react-twitch-embed-video";
import NavBar from './NavBar.js';
import { Container } from 'reactstrap';

function App() {

  const [height, setHeight] = useState('433px');
  
  const [liveStreams, setLiveStreams] = useState([]);

  const [channel, setChannel] = useState('')

  const [title, setTitle] = useState('')

  var randomStream = {}

  var streams = [];

  var time = new Date()

  var cachedTime = '';

  var currentTime = time.getTime();

  async function loadStreams() {
  
    var token = ''

    var auth = await fetch('https://id.twitch.tv/oauth2/token?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&client_secret=ftkfalr4ztrnj1lpn1cgm61elygbxz&grant_type=client_credentials', {
      method: 'POST'
    }).then((response) => response.json())
    .then((data) => {
      token = 'Bearer ' + data.access_token;
    })
  
    var cursor = '';
  
    do {
      var load = await fetch('https://api.twitch.tv/helix/streams?game_id=516575&first=100&language=en&after=' + cursor + '', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        data.data.forEach(stream => {
          if(stream.viewer_count <= 50) {
            let live = { 
              user_id: stream.user_id,
              user_name: stream.user_name, 
              title: stream.title, 
            }
            streams.push(live)
            setLiveStreams(oldArray => [...oldArray, live])
          }
        })
        cursor = data.pagination.cursor
      })
    } while(cursor !== undefined)

    cachedTime = time.setMinutes(time.getMinutes() + 5)

    sessionStorage.removeItem('time')

    sessionStorage.setItem('time', cachedTime)

    sessionStorage.setItem('streamsArray', JSON.stringify(streams))

    randomStream = streams[Math.floor(Math.random()*streams.length)];

    setChannel(randomStream.user_name)

    setTitle(randomStream.title)

  }

  async function loadFromCache() {
  
    streams = JSON.parse(sessionStorage.getItem('streamsArray'))

    randomStream = streams[Math.floor(Math.random()*streams.length)];

    setChannel(randomStream.user_name)

    setTitle(randomStream.title)

  }

  useEffect(() => {

    cachedTime = sessionStorage.getItem('time')

    if (currentTime > cachedTime) {
      
      console.log("Pulling Streams!")
      
      loadStreams()

    } else {

      console.log("Cached Streams!")
      
      loadFromCache()

    }
  
  }, [height]);

  return (

    <div className="App">

      <NavBar />
        
        <header className="App-header">

          <Container>

              <h1>{channel}</h1>

              { title === '' ? <h2>Shuffling the deck of streams...</h2> : <ReactTwitchEmbedVideo theme="dark" width="100%" height={height} channel={channel} /> }  

          </Container>

        </header>

    </div>

  );
}

export default App;
