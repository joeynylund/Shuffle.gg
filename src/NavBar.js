import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Shuffle.</NavbarBrand>
      </Navbar>
    </div>
  );
}

export default Example;