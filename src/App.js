import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Collapse,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'

function App({location}) {

  const [auth, setAuth] = useState(localStorage.getItem('auth') === 'true' ? 'true' : 'false')

  const [games, setGames] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const NavBar2 = () => {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/"><img src="./shuffle-logo.png" width="200px" /></NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              
            </Nav>
            
            {auth === 'true' ? <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret style={{marginTop:"-30px"}}>
              <img src={localStorage.getItem("profile_image")} width="50px" height="50px" style={{borderRadius:"50%", display:"inline"}} /><h6 style={{color:"#fff", fontFamily:"Poppins", display:"inline", paddingLeft:"15px", paddingRight:"10px"}}>{localStorage.getItem('display_name')}</h6>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={(e) => {
                  localStorage.clear();
                  setAuth('false')
                }}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> : <NavbarText style={{cursor:"pointer", color:"white", paddingRight:"15px"}} onClick={(e) => {
                var newWindow = window.open("https://id.twitch.tv/oauth2/authorize?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=token")
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

  function logout() {
  }

  useEffect(() => {

    loadGames()
  
  }, []);

  return (

    <div className="App">

      <NavBar2 />
        
        <header className="App-header">

          <Container>

            
            <div><Row style={{justifyContent:"center"}}>

              <h1 style={{fontWeight:"bold", fontFamily:"Poppins", color:"#21FF8A"}}>Welcome to Shuffle.</h1>

            </Row>

            <Row style={{justifyContent:"center"}}>

              <h6 style={{fontFamily:"Poppins", color:"#21FF8A", marginBottom:"2rem"}}>Select a game you'd like to watch</h6>

            </Row>

            <Row>

              {games.map(game => (
                
                  <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover">
                    <Link to={{
                  pathname: "/game/" + game.name,
                }}>
                    <img src={game.image} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)", animation: game.css}} className="animate hover2" />
                    <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px", animation: game.css}} className="animate">{game.name}</h6>
                    </Link>
                  </Col>
                

              ))}

            </Row></div>

          </Container>

        </header>

    </div>

  );

}

export default App;
