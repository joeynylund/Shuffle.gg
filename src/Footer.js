import React, { useState, useEffect } from 'react';
import './App.css';
import { Container,
  Navbar,
  NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';

function Footer() {

    return (
    <Navbar color="dark" dark className="footer">
                <Container style={{justifyContent: 'flex-end'}}>
                    <NavbarBrand ></NavbarBrand>
                </Container>
            </Navbar>
    )
}


export default Footer;
