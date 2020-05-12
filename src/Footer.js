import React, { useState, useEffect } from 'react';
import './App.css';
import { Container,
  Navbar,
  NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';

function Footer() {

    return (
    <Navbar color="dark" dark className="fixed-bottom">
                <Container style={{justifyContent: 'flex-end'}}>
                    <NavbarBrand ><a href="https://twitter.com/shufflegg" target="_blank"><FontAwesomeIcon icon={faTwitter} style={{color:"#22FF8A",cursor:'pointer',marginRight:"15px"}} /></a><a href="https://discord.gg/bXAHTSx" target="_blank"><FontAwesomeIcon icon={faDiscord} style={{color:"#22FF8A",cursor:'pointer'}} /></a></NavbarBrand>
                </Container>
            </Navbar>
    )
}


export default Footer;
