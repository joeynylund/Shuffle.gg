import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Alert,
  Input,
  Button,
  Modal, 
  ModalHeader, 
  ModalBody,
  ModalFooter,
  Form, FormGroup, Label } from 'reactstrap';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import  RangeSlider  from 'react-bootstrap-range-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faCog } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import Spinner from 'react-spinkit';
import ReactGA from 'react-ga';
require('dotenv').config()

function App() {

  const [ value, setValue ] = useState(25);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  var gamesArray = [];

  var shuffledGames = [];

  const [loading, setLoading] = useState(true);

  const [searchLoading, setSearchLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [searchResults, setSearchReults] = useState([]);

  const [auth, setAuth] = useState(localStorage.getItem('auth') === 'true' ? 'true' : 'false');

  const [featured, setFeatured] = useState([]);

  const [shuffled, setShuffled] = useState([]);

  const [games, setGames] = useState([]);

  const [visible, setVisible] = useState(false);

    const onDismiss = () => setVisible(false);

  const NavBar2 = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>

        <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/"><img src="./shuffle-logo.png" alt="Shuffle.gg Logo" width="200px" /></NavbarBrand>
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
              <FontAwesomeIcon icon={faCog} size="2x" onClick={toggle} style={{color:"#22FF8A",cursor:'pointer'}} />
            </NavbarText>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  function shuffleGames() {

    var cachedGames = JSON.parse(localStorage.getItem('games'))

    var n;

    for (n=1; n <= 6; n++) {
      var i = Math.floor(Math.random()*cachedGames.length)
      shuffledGames.push(cachedGames[i])
    }

    setShuffled(shuffledGames)

  }

  async function loadGames() {
  
    var token = '';

    var cursor = '';

    await fetch('https://id.twitch.tv/oauth2/token?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&client_secret=' + process.env.REACT_APP_TWITCH_SECRET + '&grant_type=client_credentials', {
      method: 'POST'
    }).then((response) => response.json())
    .then((data) => {
      token = 'Bearer ' + data.access_token;
    })
    await fetch('https://api.twitch.tv/helix/games/top?first=6', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        let i = 0
        data.data.forEach(game => {
          let newImagePath = game.box_art_url.replace('{width}', '271').replace('{height}', '328');
          let animation = 'fadeIns 0.5s' + ' ' + i + 's';
          let gameName = game.name;
          let displayName = game.name;
          if(gameName.length > 25) {
            gameName = gameName.slice(0,25) + '.....';
          }

          let live = {
            id: game.id,
            display_name: game.name,
            name: gameName,
            image: newImagePath,
            css: animation
          }
          i = i + 0.125
          setFeatured(oldArray => [...oldArray, live])
          
        })
        
      })
      do {
      var load = await fetch('https://api.twitch.tv/helix/games/top?first=100&after=' + cursor + '', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        let i = 0
        data.data.forEach(game => {
          let newImagePath = game.box_art_url.replace('{width}', '271').replace('{height}', '328');
          let animation = 'fadeIns 0.5s' + ' ' + i + 's';
          let gameName = game.name;
          let displayName = game.name;
          if(gameName.length > 25) {
            gameName = gameName.slice(0,25) + '.....';
          }

          let live = {
            id: game.id,
            display_name: game.name,
            name: gameName,
            image: newImagePath,
            css: animation
          }
          i = i + 0.125
          gamesArray.push(live)
          
        })
        cursor = data.pagination.cursor
      })
    } while(cursor !== undefined)

      var n;

      for (n=1; n <= 6; n++) {
        var i = Math.floor(Math.random()*gamesArray.length)
        shuffledGames.push(gamesArray[i])
      }

      setShuffled(shuffledGames)

      setGames(gamesArray)
      setLoading(false)
      setSearchLoading(false)

      localStorage.setItem('games' ,JSON.stringify(gamesArray))

      sessionStorage.removeItem('streams')
      sessionStorage.removeItem('streamsArray')
      sessionStorage.removeItem('time')

  }

  useEffect(() => {

    ReactGA.initialize('UA-165630956-1');
    ReactGA.pageview(window.location.pathname);

    if(localStorage.getItem('games') === null) {
      loadGames()
    } else {
      setLoading(false)
      setSearchLoading(false)
      var cachedGames = JSON.parse(localStorage.getItem('games'))
      setFeatured(cachedGames.slice(0,6))
      setGames(cachedGames)
      var n;

      for (n=1; n <= 6; n++) {
        var i = Math.floor(Math.random()*cachedGames.length)
        shuffledGames.push(cachedGames[i])
      }

      setShuffled(shuffledGames)
      sessionStorage.removeItem('streamsArray')
      sessionStorage.removeItem('time')
    }

    
  
  }, []);

  return (

    <div className="App">

        <Alert color="danger" isOpen={visible} toggle={onDismiss}>
          Hmmm that didn't work. Try logging in again!
        </Alert>

      <NavBar2 />

          <Container>
            
            {loading === false ? <div><Row style={{justifyContent:"center"}}>

              <h1 style={{fontWeight:"bold", fontFamily:"Poppins", color:"#21FF8A", padding:"0px 10px", animation:"fadeIns 0.5s 0s"}} className="animate">Let's find something to watch.</h1>

            </Row>

            <Row style={{justifyContent:"center"}}>

              <h6 style={{fontFamily:"Poppins", color:"#21FF8A", marginBottom:"2rem", animation:"fadeIns 0.5s 0.25s"}} className="animate">To get started, select a game</h6>

            </Row>

            <Row style={{paddingBottom:"30px"}}>

            <Col xs={{ size: 12, offset: 0 }} sm={{ size: 12, offset: 0 }} md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }} xl={{ size: 6, offset: 3 }}>

              
              {searchLoading === true ? <div><h6 style={{fontFamily:"Poppins"}}>Loading search...</h6><Spinner name="ball-pulse-sync" color="#22FF8A" /></div> : <Input style={{animation:"fadeIns 0.5s 0.25s"}} className="animate" type="text" value={search} onChange={(e) => {
                setSearch(e.target.value);
                setSearchReults('')
                  const test = games.filter(gun => {
                    return gun.name.toLowerCase().includes(e.target.value.toLowerCase())
                  });
                setSearchReults([...new Set(test)])

    

    }} placeholder="Search for a game..." />}

    </Col>
              
            </Row>
            

            {search.length > 0 ? <div><Row><h3 style={{fontFamily:"Poppins", marginBottom:"1rem", animation:"fadeIns 0.5s 0.25s"}} className="animate">Search Results</h3></Row><Row> {searchResults.slice(0,12).map((result, index) => (
              <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover" key={index}>
              <Link to={{
            pathname: "/game/" + result.display_name,
          }}>
              <img src={result.image} alt={result.name + " Box Art"} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)"}} className="hover2" />
              <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px"}}>{result.name}</h6>
              </Link>
            </Col>
            ))} </Row></div> : <div><Row style={{margin:'0'}}><h3 style={{fontFamily:"Poppins", marginBottom:"1rem", animation:"fadeIns 0.5s 0.25s", textDecoration:"underline #22FF8A"}} className="animate">Top Games</h3></Row><Row>{featured.map(game => (
                  <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover" key={game.name}>
                    <Link to={{
                  pathname: "/game/" + game.display_name,
                }}>
                    <img src={game.image} alt={game.name + " Box Art"} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)", animation: game.css}} className="animate hover2" />
                    <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px", animation: game.css}} className="animate">{game.name}</h6>
                    </Link>
                  </Col>

              ))} </Row>
              <Row><Col md="12"><h3 style={{display:"inline", fontFamily:"Poppins", marginBottom:"1rem", animation:"fadeIns 0.5s 0.25s", float:"left", textDecoration:"underline #22FF8A"}} className="animate">Shuffled Games</h3><FontAwesomeIcon icon={faRedo} className="animate" style={{color:"#22FF8A",fontSize:"30px",cursor:'pointer', float:'right', animation:"fadeIns 0.5s 0.5s"}} onClick={shuffleGames} /></Col></Row><Row>{shuffled.map(game => (
                  <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover" key={game.name}>
                    <Link to={{
                  pathname: "/game/" + game.display_name,
                }}>
                    <img src={game.image} alt={game.name + " Box Art"} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)", animation: 'fadeIns 0.5s 0.25s'}} className="animate hover2" />
                    <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px", animation: 'fadeIns 0.5s 0.25s'}} className="animate">{game.name}</h6>
                    </Link>
                  </Col>

              ))} </Row></div>}

            
            </div> : <div className="App-header"><h2 style={{fontFamily:"Poppins"}}>Loading games...</h2><Spinner name="ball-pulse-sync" color="#22FF8A" /></div>}

          </Container>

          <div className="footer" style={{padding:"20px 0px", marginTop:"40px", backgroundColor:"#121212"}}>

            <Container>
              <p style={{display:"inline", float:"left"}}> &copy; 2020 Shuffle.GG</p>
              <div style={{float:"right"}}>
              <a href="https://twitter.com/shufflegg" target="_blank"><FontAwesomeIcon icon={faTwitter} size="2x" style={{color:"#22FF8A",cursor:'pointer',marginRight:"15px", marginBottom:"1rem"}} /></a>
              <a href="https://discord.gg/bXAHTSx" target="_blank"><FontAwesomeIcon icon={faDiscord} size="2x" style={{color:"#22FF8A",cursor:'pointer',marginBottom:"1rem"}} /></a>
              </div>
            </Container>

          </div>

          <Modal isOpen={modal} toggle={toggle} centered={true}>
            <ModalHeader toggle={toggle} style={{fontFamily:"Poppins"}}>Shuffle Settings</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">Stream Language</Label>
                  <Input type="select" name="select" defaultValue="en" id="exampleSelect" onChange={(e) => console.log(`${e.target.value}`)}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="pt">Portuguese</option>
                    <option value="de">German</option>
                    <option value="ko">Korean</option>
                    <option value="ru">Russian</option>
                    <option value="fr">French</option>
                    <option value="it">Italian</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Max Viewer Count</Label>
                  <RangeSlider value={value} size="lg" tooltip="on" onChange={changeEvent => setValue(changeEvent.target.value)} min={1} max={25} />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button style={{backgroundColor:"#22FF8A", color:"#121212", fontFamily:"Poppins", border:"none"}} onClick={toggle}>Save</Button>{' '}
            </ModalFooter>
          </Modal>

    </div>

    

  );

}

export default App;
