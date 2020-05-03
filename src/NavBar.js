import React, { useState } from 'react';
import {
  Collapse,
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
  NavbarText
} from 'reactstrap';
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons';

function logout() {
  sessionStorage.removeItem("auth");
  sessionStorage.removeItem("display_name");
  sessionStorage.removeItem("profile_image");
}

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/"><img src="./shuffle-logo.png" width="200px" /></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            
          </Nav>
          
          {sessionStorage.getItem('auth') === 'true' ? <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret style={{marginTop:"-30px"}}>
              <img src={sessionStorage.getItem("profile_image")} width="50px" height="50px" style={{borderRadius:"50%", display:"inline"}} /><h6 style={{color:"#fff", fontFamily:"Poppins", display:"inline", paddingLeft:"15px", paddingRight:"10px"}}>{sessionStorage.getItem('display_name')}</h6>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={logout()}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> : <NavbarText><a href="https://id.twitch.tv/oauth2/authorize?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token">Login with Twitch</a></NavbarText>}
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Example;