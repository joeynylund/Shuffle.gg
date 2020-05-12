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
  Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-spinkit';
import ReactGA from 'react-ga';
import Footer from './Footer';

function App({location}) {

  var gamesArray = [];

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [searchResults, setSearchReults] = useState([]);

  const [auth, setAuth] = useState(localStorage.getItem('auth') === 'true' ? 'true' : 'false');

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

            {auth === 'true' ? <UncontrolledDropdown nav inNavbar>
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
            </UncontrolledDropdown> : <NavbarText style={{cursor:"pointer", color:"white", padding:"0.5rem 1rem"}} onClick={(e) => {
              ReactGA.event({
                category: "Logged In",
                action: "User logged in with Twitch",
              });
                var newWindow = window.open("https://id.twitch.tv/oauth2/authorize?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&redirect_uri=https://shuffle-gg.web.app/auth&response_type=token")
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
            
          </Collapse>
        </Navbar>
      </div>
    );
  }

  async function loadGames() {
  
    var token = '';

    var cursor = '';

    var auth = await fetch('https://id.twitch.tv/oauth2/token?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&client_secret=ftkfalr4ztrnj1lpn1cgm61elygbxz&grant_type=client_credentials', {
      method: 'POST'
    }).then((response) => response.json())
    .then((data) => {
      token = 'Bearer ' + data.access_token;
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
          setGames(oldArray => [...oldArray, live])
          gamesArray.push(live)
        })
        setLoading(false)
        cursor = data.pagination.cursor
      })
    } while(cursor !== undefined)

      console.log(gamesArray)

      sessionStorage.removeItem('streams')
      sessionStorage.removeItem('streamsArray')
      sessionStorage.removeItem('time')

      

  }

  useEffect(() => {

    ReactGA.initialize('UA-165630956-1');
    ReactGA.pageview(window.location.pathname);

    loadGames()
  
  }, []);

  return (

    <div className="App">

      <Alert color="danger" isOpen={visible} toggle={onDismiss}>
        Hmmm that didn't work. Try logging in again!
      </Alert>

      <NavBar2 />
        
        <header className="App-header">

          <Container>
            
            {loading === false ? <div><Row style={{justifyContent:"center"}}>

              <h1 style={{fontWeight:"bold", fontFamily:"Poppins", color:"#21FF8A", padding:"0px 10px", animation:"fadeIns 0.5s 0s"}} className="animate">Let's find something to watch.</h1>

            </Row>

            <Row style={{justifyContent:"center"}}>

              <h6 style={{fontFamily:"Poppins", color:"#21FF8A", marginBottom:"2rem", animation:"fadeIns 0.5s 0.25s"}} className="animate">To get started, select a game</h6>

            </Row>

            <Row style={{paddingBottom:"30px"}}>

            <Col xs={{ size: 12, offset: 0 }} sm={{ size: 12, offset: 0 }} md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }} xl={{ size: 6, offset: 3 }}>

              
              <Input style={{animation:"fadeIns 0.5s 0.25s"}} className="animate" type="text" value={search} onChange={(e) => {
                setSearch(e.target.value);
                setSearchReults('')
                  const test = games.filter(gun => {
                    return gun.name.toLowerCase().includes(e.target.value.toLowerCase())
                  });
                setSearchReults([...new Set(test)])

    

    }} placeholder="Search for a game..." />

    </Col>
              
            </Row>

            <Row>

            {search.length > 0 ? searchResults.slice(0,12).map((result, index) => (
              <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover" key={index}>
              <Link to={{
            pathname: "/game/" + result.display_name,
          }}>
              <img src={result.image} alt={result.name + " Box Art"} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)"}} className="hover2" />
              <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px"}}>{result.name}</h6>
              </Link>
            </Col>
            )) : games.slice(0,12).map(game => (
                
                  <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover" key={game.name}>
                    <Link to={{
                  pathname: "/game/" + game.display_name,
                }}>
                    <img src={game.image} alt={game.name + " Box Art"} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)", animation: game.css}} className="animate hover2" />
                    <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px", animation: game.css}} className="animate">{game.name}</h6>
                    </Link>
                  </Col>
                

              ))}

            </Row>
            
            </div> : <div><h2 style={{fontFamily:"Poppins"}}>Loading games...</h2><Spinner name="ball-pulse-sync" color="#22FF8A" /></div>}

          </Container>

        </header>

        <Footer />

    </div>

  );

}

export default App;
