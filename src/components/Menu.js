import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

export default class Menu extends React.Component {
  render() {
    return (
      <div>
        <Navbar
          bg="primary"
          variant="dark"
          className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm"
        >
          <Navbar.Brand href="/vilius-profile/#/" className="p-1 text-dark">Home</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/vilius-profile/#/projects" className="p-2 text-dark">Projects</Nav.Link>
            <Nav.Link href="/vilius-profile/#/about-me" className="p-2 text-dark">About Me</Nav.Link>
            <Nav.Link href="/vilius-profile/#/contacts" className="p-2 text-dark">Contacts</Nav.Link>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
