import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

export default class Menu extends React.Component {
  render() {
    return (
      <div>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="/vilius-profile/#/">Home</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/vilius-profile/#/projects">Projects</Nav.Link>
            <Nav.Link href="/vilius-profile/#/about-me">About Me</Nav.Link>
            <Nav.Link href="/vilius-profile/#/contacts">Contacts</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
