import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactGA from 'react-ga';

function App({location}) {

  const [auth, setAuth] = useState(localStorage.getItem('auth') === 'true' ? 'true' : 'false')

  const [games, setGames] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const NavBar2 = () => {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/"><img src="./shuffle-logo.png" alt="Shuffle.gg Logo" width="200px" /></NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              
            </Nav>
            <NavItem>
              <NavLink href="/components/">About Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/components/">How It Works</NavLink>
            </NavItem>
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
                var newWindow = window.open("https://id.twitch.tv/oauth2/authorize?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&redirect_uri=https%3A%2F%2Fshuffle-gg.web.app%2Fauth&response_type=token")
                var timer = setInterval(function() { 
                    if(newWindow.closed) {
                        clearInterval(timer);
                        setAuth('true')
                    }
                }, 1000);
              }}>Login with Twitch</NavbarText> }
            
          </Collapse>
        </Navbar>
      </div>
    );
  }

  async function loadGames() {
  
    var token = ''

    var auth = await fetch('https://id.twitch.tv/oauth2/token?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&client_secret=ftkfalr4ztrnj1lpn1cgm61elygbxz&grant_type=client_credentials', {
      method: 'POST'
    }).then((response) => response.json())
    .then((data) => {
      token = 'Bearer ' + data.access_token;
    })
  
      var load = await fetch('https://api.twitch.tv/helix/games/top?first=12', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        let i = 0
        data.data.forEach(game => {
          let newImagePath = game.box_art_url.replace('{width}', '271').replace('{height}', '328');
          let animation = 'fadeIns 0.5s' + ' ' + i + 's'

          let live = {
            id: game.id,
            name: game.name,
            image: newImagePath,
            css: animation
          }
          i = i + 0.125
          setGames(oldArray => [...oldArray, live])
        })
      })

      sessionStorage.removeItem('streams')
      sessionStorage.removeItem('time')

  }

  useEffect(() => {

    ReactGA.initialize('UA-165630956-1');
    ReactGA.pageview(window.location.pathname);

    loadGames()
  
  }, []);

  return (

    <div className="App">

      <NavBar2 />
        
        <header className="App-header">

          <Container>
            
            {games.length > 1 ? <div><Row style={{justifyContent:"center"}}>

              <h1 style={{fontWeight:"bold", fontFamily:"Poppins", color:"#21FF8A", padding:"0px 10px", animation:"fadeIns 0.5s 0s"}} className="animate">Let's find something to watch.</h1>

            </Row>

            <Row style={{justifyContent:"center"}}>

              <h6 style={{fontFamily:"Poppins", color:"#21FF8A", marginBottom:"2rem", animation:"fadeIns 0.5s 0.25s"}} className="animate">To get started, select a game</h6>

            </Row>

            <Row>

              {games.map(game => (
                
                  <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover" key={game.name}>
                    <Link to={{
                  pathname: "/game/" + game.name,
                }}>
                    <img src={game.image} alt={game.name + " Box Art"} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)", animation: game.css}} className="animate hover2" />
                    <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px", animation: game.css}} className="animate">{game.name}</h6>
                    </Link>
                  </Col>
                

              ))}

            </Row></div> : <div></div>}

          </Container>

        </header>

    </div>

  );

}

export default App;
