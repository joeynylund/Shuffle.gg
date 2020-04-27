import React, { useState, useEffect } from 'react';
import './App.css';
import ReactTwitchEmbedVideo from "react-twitch-embed-video";
import NavBar from './NavBar.js';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'
import styled, { keyframes } from 'styled-components';
import { fadeInDown } from 'react-animations'

const Fade = styled.div`animation: 0.5s ${keyframes`${fadeInDown}`}`;

const Fade2 = styled.div`animation: 1s ${keyframes`${fadeInDown}`}`;

const Fade3 = styled.div`animation: 1.5s ${keyframes`${fadeInDown}`}`;

function App() {

  const [height, setHeight] = useState('433px');
  
  const [liveStreams, setLiveStreams] = useState([]);

  const [channel, setChannel] = useState('')

  const [title, setTitle] = useState('')

  const [logo, setLogo] = useState('')

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

    cachedTime = time.setMinutes(time.getMinutes() + 2)

    sessionStorage.removeItem('time')

    sessionStorage.setItem('time', cachedTime)

    sessionStorage.setItem('streamsArray', JSON.stringify(streams))

    randomStream = streams[Math.floor(Math.random()*streams.length)];

    setChannel(randomStream.user_name)

    var image = await fetch('https://api.twitch.tv/helix/users?login=' + randomStream.user_name + '', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
      }
      }).then((response) => response.json())
      .then((data) => {
        console.log(data.data[0].profile_image_url)
        setLogo(data.data[0].profile_image_url)
      })

    setTitle(randomStream.title)

  }

  async function loadFromCache() {
  
    streams = JSON.parse(sessionStorage.getItem('streamsArray'))

    randomStream = streams[Math.floor(Math.random()*streams.length)];

    setChannel(randomStream.user_name)

    var image = await fetch('https://api.twitch.tv/helix/users?login=' + randomStream.user_name + '', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
      }
      }).then((response) => response.json())
      .then((data) => {
        console.log(data.data[0].profile_image_url)
        setLogo(data.data[0].profile_image_url)
      })

    setTitle(randomStream.title)

  }

  function shuffle() {

    console.clear()

    cachedTime = sessionStorage.getItem('time')

    if (currentTime > cachedTime) {
      
      console.log("Pulling Streams!")

      sessionStorage.clear()

      setChannel('')
      
      loadStreams()

    } else {

      console.log("Cached Streams!")
      
      loadFromCache()

    }

  }

  window.setInterval(function() {
    console.clear()
  },30000)

  useEffect(() => {

    cachedTime = sessionStorage.getItem('time')

    if (currentTime > cachedTime) {
      
      console.log("Pulling Streams!")

      sessionStorage.clear()

      setChannel('')
      
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

              { channel === '' ? <h2 style={{textAlign:"left", fontFamily:"Poppins"}}>Shuffling the deck of streams...</h2> : 
              <div>
              <Row style={{marginBottom:"15px"}}>

                <Col md="1">
                
                  <Fade2><img src={logo} style={{ borderRadius: '50%', width: '75px' }}/></Fade2>
              
                </Col>

                <Col md="9">

                <Fade2><h2 style={{textAlign:"left", fontFamily:"Poppins"}}>{channel}</h2></Fade2>
                <Fade3><h6 style={{textAlign:"left", fontFamily:"Poppins"}}>{title}</h6></Fade3>

                </Col>

                <Col md="2" style={{textAlign:"right"}}>

                <Fade3><FontAwesomeIcon icon={faRandom} style={{color:"#22FF8A",fontSize:"40px",marginTop:'25px',cursor:'pointer'}} onClick={shuffle}/></Fade3>

                </Col>

              </Row>
              
              <Fade><ReactTwitchEmbedVideo theme="dark" width="100%" height={height} channel={channel} /></Fade> </div>}  

          </Container>

        </header>

    </div>

  );
}

export default App;
