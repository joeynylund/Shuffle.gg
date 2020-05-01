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
          <NavbarText>{sessionStorage.getItem('auth') === 'true' ? <h6>{sessionStorage.getItem('display_name')}</h6> : <a href="https://id.twitch.tv/oauth2/authorize?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token">Login with Twitch</a>}</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Example;