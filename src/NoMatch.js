import React, { useState, useEffect } from 'react';
import './App.css';
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
  Alert } from 'reactstrap';
import ReactGA from 'react-ga';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';

function App() {

  const [auth, setAuth] = useState(localStorage.getItem('auth') === 'true' ? 'true' : 'false');

  const NavBar2 = () => {

    const [visible, setVisible] = useState(false);

  const onDismiss = () => setVisible(false);

    const [isOpen, setIsOpen] = useState(false);

    return (

        <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/"><img src="./shuffle-logo.png" alt="Shuffle.gg Logo" width="200px" /></NavbarBrand>
          <NavbarToggler onClick={(e) => setIsOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              
            </Nav>
            <NavbarText>
              <a href="https://twitter.com/shufflegg" target="_blank"><FontAwesomeIcon icon={faTwitter} size="2x" style={{color:"#22FF8A",cursor:'pointer',marginRight:"15px"}} /></a>
            </NavbarText>
            <NavbarText>
              <a href="https://discord.gg/bXAHTSx" target="_blank"><FontAwesomeIcon icon={faDiscord} size="2x" style={{color:"#22FF8A",cursor:'pointer'}} /></a>
            </NavbarText>
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
            </UncontrolledDropdown> : <NavbarText style={{cursor:"pointer", color:"white", padding:"0.5rem 1rem", display:"block"}} onClick={(e) => {
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
                        }
                    }
                    
                }, 1000);
              }}><h6 style={{color:"#fff", fontFamily:"Poppins", display:"inline", paddingLeft:"15px", paddingRight:"10px"}}>Login with Twitch</h6></NavbarText> }
            
          </Collapse>
        </Navbar>
    );
  }

  useEffect(() => {

    ReactGA.initialize('UA-165630956-1');
    ReactGA.pageview(window.location.pathname);
  
  }, []);

  return (

    <div className="App">

      <NavBar2 />
        
        <header className="App-header">

          <Container>
            
            <Row style={{justifyContent:"center"}}>

              <h1 style={{fontWeight:"bold", fontFamily:"Poppins", color:"#21FF8A", padding:"0px 10px", animation:"fadeIns 0.5s 0s"}} className="animate">Ain't nothin' here.</h1>

            </Row>

            <Row style={{justifyContent:"center"}}>

              <img src="https://media.giphy.com/media/jWexOOlYe241y/giphy.gif" />

            </Row>

          </Container>

        </header>

    </div>

  );

}

export default App;
