import React, { useState, useEffect } from 'react';
import './App.css';
import Spinner from 'react-spinkit';
import ReactTwitchEmbedVideo from "react-twitch-embed-video";
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faAngleLeft, faCog } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import styled, { keyframes } from 'styled-components';
import { fadeInDown } from 'react-animations';
import ReactGA from 'react-ga';

const Fade = styled.div`animation: 0.75s ${keyframes`${fadeInDown}`}`;

const Fade2 = styled.div`animation: 0.75s 0.25s ${keyframes`${fadeInDown}`}`;

const Fade3 = styled.div`animation: 0.75s 0.5s ${keyframes`${fadeInDown}`}`;

function App({ match, location }) {

  const [empty, setEmpty] = useState(false);

  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const [visible, setVisible] = useState(false);

  const onDismiss = () => setVisible(false);

  const [auth, setAuth] = useState(localStorage.getItem('auth') === 'true' ? 'true' : 'false');

  const [height, setHeight] = useState('433px');
  
  const [channel, setChannel] = useState('');

  const [title, setTitle] = useState('');

  const [logo, setLogo] = useState('');

  const [otherGames, setOtherGames] = useState([]);

  var randomStream = {}

  var streams = [];

  var time = new Date()

  var cachedTime = '';

  var currentTime = time.getTime();

  var token = ''

  const NavBar2 = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>

      <Alert color="danger" isOpen={visible} toggle={onDismiss}>
        Hmmm that didn't work. Try logging in again!
      </Alert>
      <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/"><img src="../shuffle-logo.png" alt="Shuffle.gg Logo" width="200px" /></NavbarBrand>
        <NavbarToggler onClick={(e) => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>

          </Nav>
        
          {auth === 'true' ? <UncontrolledDropdown nav inNavbar style={{display:"block"}}>
            <DropdownToggle nav caret>
            <img src={localStorage.getItem("profile_image")} alt="Twitch User Logo" width="50px" height="50px" style={{borderRadius:"50%", display:"inline"}} /><h6 style={{color:"#fff", fontFamily:"Poppins", display:"inline", paddingLeft:"15px", paddingRight:"10px"}}>{localStorage.getItem('display_name')}</h6>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={(e) => {
                ReactGA.event({
                  category: "Logged Out",
                  action: "User logged out",
                });
                localStorage.clear();
                setAuth('false')
              }}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> : <NavbarText style={{ backgroundColor:"#212121", borderRadius:"10px", marginRight:"15px", cursor:"pointer", color:"white", padding:"0.5rem 1rem", display:"block"}} onClick={(e) => {
            ReactGA.event({
              category: "Logged In",
              action: "User logged in with Twitch",
            });
              var newWindow = window.open("https://id.twitch.tv/oauth2/authorize?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&redirect_uri=https://www.shuffle.gg/auth&response_type=token")
              var timer = setInterval(function() { 
                  if(newWindow.closed) {
                      clearInterval(timer);
                      setAuth('true');
                      if (localStorage.getItem('display_name') != null) {
                      } else {
                        setAuth('false')
                        setVisible(true)
                      }
                  }
                  
              }, 1000);
            }}><h6 style={{color:"#fff", fontFamily:"Poppins", display:"inline", paddingLeft:"15px", paddingRight:"10px"}}>Login with Twitch</h6></NavbarText> }
            <NavbarText>
            <FontAwesomeIcon icon={faCog} size="2x" style={{color:"#22FF8A",cursor:'pointer'}} />
          </NavbarText>
        </Collapse>
      </Navbar>
    </div>
    );
  }

  async function loadStreams() {

    var shuffledGames = [];

    var auth = await fetch('https://id.twitch.tv/oauth2/token?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&client_secret=ftkfalr4ztrnj1lpn1cgm61elygbxz&grant_type=client_credentials', {
      method: 'POST'
    }).then((response) => response.json())
    .then((data) => {
      token = 'Bearer ' + data.access_token;
    })
  
    var cursor = '';

    var game_id = '';

    var gameName = '';

    if(match.params.game.includes('&') === true) {
      gameName = match.params.game.replace('&', '%26');
    } else {
      gameName = match.params.game;
    }

    var getGame = await fetch('https://api.twitch.tv/helix/games?name=' + gameName + '', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        game_id = data.data[0].id;
      }).catch(function(error) {
        history.push('/')
      })
  
    do {
      var load = await fetch('https://api.twitch.tv/helix/streams?game_id=' + game_id + '&first=100&language=en&after=' + cursor + '', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        data.data.forEach(stream => {
          if(stream.viewer_count <= 25) {
            let live = { 
              user_id: stream.user_id,
              user_name: stream.user_name, 
              title: stream.title, 
            }
            streams.push(live)
          }
        })
        cursor = data.pagination.cursor
      })
    } while(cursor !== undefined)

    if (streams.length === 0) {

      setLoading(false)

      setEmpty(true)

      var cachedGames = JSON.parse(localStorage.getItem('games'))

      var n;

      for (n=1; n <= 12; n++) {
        var i = Math.floor(Math.random()*cachedGames.length)
        shuffledGames.push(cachedGames[i])
      }

      setOtherGames(shuffledGames)

    } else {

      cachedTime = time.setMinutes(time.getMinutes() + 5)

      sessionStorage.removeItem('time')
  
      sessionStorage.setItem('time', cachedTime)
  
      sessionStorage.setItem('streamsArray', JSON.stringify(streams))

      randomStream = streams[Math.floor(Math.random()*streams.length)];

      setChannel(randomStream.user_name)
    }

    

    var image = await fetch('https://api.twitch.tv/helix/users?login=' + randomStream.user_name + '', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        setLogo(data.data[0].profile_image_url)
      })

    setTitle(randomStream.title)

    setLoading(false)

  }

  async function loadFromCache() {

    var auth = await fetch('https://id.twitch.tv/oauth2/token?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&client_secret=ftkfalr4ztrnj1lpn1cgm61elygbxz&grant_type=client_credentials', {
      method: 'POST'
    }).then((response) => response.json())
    .then((data) => {
      token = 'Bearer ' + data.access_token;
    })
  
    streams = JSON.parse(sessionStorage.getItem('streamsArray'))

    randomStream = streams[Math.floor(Math.random()*streams.length)];

    setChannel(randomStream.user_name)

    var image = await fetch('https://api.twitch.tv/helix/users?login=' + randomStream.user_name + '', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        setLogo(data.data[0].profile_image_url)
      })

    setTitle(randomStream.title)

    setLoading(false)

  }

  function shuffle() {

    ReactGA.event({
      category: "Shuffle",
      action: "User shuffled to a new stream!",
    });

    cachedTime = sessionStorage.getItem('time')

    if (currentTime > cachedTime) {
      
      console.clear()

      sessionStorage.removeItem('streams')
      sessionStorage.removeItem('time')
      
      loadStreams()

    } else {

      console.clear()
      
      loadFromCache()

    }

  }

  function handleResize() {
    if (window.innerWidth < 1200 && window.innerWidth > 991) {
      setHeight('332px')
    } else if (window.innerWidth < 992 && window.innerWidth > 766) {
      setHeight('199px')
    } else if (window.innerWidth < 767) {
      setHeight('599px')
    }
  }

  function quote() {
    const quotes = [
      "Shuffling the deck...",
      "Finding your match...",
      "You're going to like this stream...we hope...",
      "Keep swiping! Uhhh, we mean shuffling!",
      "'Toto, I've a feeling we're not in that last stream anymore.' - The Wizard of Oz",
      "'To the next stream and beyond!' - Toy Story",
      "'Nobody puts this next streamer in a corner.' - Dirty Dancing",
      "'Just keep shuffling.' - Finding Nemo",
      "'Thank you, next stream' - Ariana Grande",
      "'My mama always said shuffle was like a box of chocolates. You never know what stream you're gonna get.' - Forrest Gump"
    ]

    var randomQuote = quotes[Math.floor(Math.random()*quotes.length)];

    return randomQuote;
  }

  useEffect(() => {

    ReactGA.initialize('UA-165630956-1');
    ReactGA.pageview(window.location.pathname);

    if(window.innerWidth > 1921) {
      setHeight('771px')
    } else if (window.innerWidth < 1200 && window.innerWidth > 991) {
      setHeight('332px')
    } else if (window.innerWidth < 992 && window.innerWidth > 766) {
      setHeight('199px')
    } else if (window.innerWidth < 767) {
      setHeight('599px')
    }

    cachedTime = sessionStorage.getItem('time')

    if (currentTime > cachedTime) {
      
      console.clear()

      sessionStorage.removeItem('streams')
      sessionStorage.removeItem('time')

      
      loadStreams()

    } else {

      console.clear()
      
      loadFromCache()

    }
  
  }, []);

  return (

    <div className="App">

      <NavBar2 />
        
        <header className="App-header">

          <Container>

              { 
                empty === true ? <div><h1>Nobody is currently streaming <span style={{textDecoration:"underline #22FF8A", fontFamily:"Poppins"}}>{match.params.game}</span>!</h1><h6 style={{marginBottom:"1rem", fontFamily:"Poppins", color:"#22FF8A"}}>Check out these other games</h6><Row>{otherGames.map(game => (
                  <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover" onClick={() => {
                    window.location.replace("/game/" + game.display_name);
                  }} key={game.name}>
                  
                    <img src={game.image} alt={game.name + " Box Art"} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)", animation: 'fadeIns 0.5s 0.25s'}} className="animate hover2" />
                    <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px", animation: 'fadeIns 0.5s 0.25s'}} className="animate">{game.name}</h6>
                  </Col>

              ))} </Row></div> : channel === '' ? <div><h2 style={{fontFamily:"Poppins"}}>{quote()}</h2><Spinner name="ball-pulse-sync" color="#22FF8A" /></div> : 
              <div>

              <Row>

                <h2 style={{fontFamily:"Poppins", marginBottom:"10px", paddingLeft:"15px"}}><Link to={{
                  pathname: "/",
                }}><FontAwesomeIcon icon={faAngleLeft} style={{color:"#22FF8A",cursor:'pointer'}} /></Link> <span style={{textDecoration:"underline #22FF8A"}}>{match.params.game}</span></h2>

              </Row> 
              <Row style={{marginBottom:"10px"}}>

                <Col xs="1" md="2" xl="1" className="logo-container">
                
                  <Fade2><img src={logo} alt="Twitch User Logo" className="fade2 logo" style={{ borderRadius: '50%', width: '100%', maxWidth: "90px" }}/></Fade2>
              
                </Col>

                <Col xs="10" sm="10" md="9" xl="10" className="name-title-container">

                <Fade2><h2 className="fade2 streamer-name" style={{textAlign:"left", fontFamily:"Poppins"}}>{channel}</h2></Fade2>
                <Fade3><h6 className="fade3 title" style={{textAlign:"left", fontFamily:"Poppins"}}>{title}</h6></Fade3>

                </Col>

                <Col xs="2" sm="2" md="1" xl="1" style={{textAlign:"right"}} className="shuffle-container">

                <Fade3><FontAwesomeIcon icon={faRandom} className="fade3 shuffle" style={{color:"#22FF8A",fontSize:"40px",cursor:'pointer'}} onClick={shuffle}/></Fade3>

                </Col>

              </Row>
              
              <Fade><div className="fade3">{loading === true ? <div></div> : <ReactTwitchEmbedVideo theme="dark" width="100%" height={height} channel={channel} />}</div></Fade> </div>
            }  

          </Container>

        </header>

        <div className="footer" style={{padding:"20px 0px", backgroundColor:"#121212"}}>

            <Container>
              <p style={{display:"inline", float:"left"}}> &copy; 2020 Shuffle.GG</p>
              <div style={{float:"right"}}>
              <a href="https://twitter.com/shufflegg" target="_blank"><FontAwesomeIcon icon={faTwitter} size="2x" style={{color:"#22FF8A",cursor:'pointer',marginRight:"15px", marginBottom:"1rem"}} /></a>
              <a href="https://discord.gg/bXAHTSx" target="_blank"><FontAwesomeIcon icon={faDiscord} size="2x" style={{color:"#22FF8A",cursor:'pointer',marginBottom:"1rem"}} /></a>
              </div>
            </Container>

          </div>

    </div>

  );
  
}

export default App;
