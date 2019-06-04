import React from 'react';
import { Navbar, Nav, Figure } from 'react-bootstrap';

export default class Menu extends React.Component {
  render() {
    return (
      <div>
        <Navbar
          bg="primary"
          variant="dark"
          className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-light border-bottom shadow rounded"
        >
          <Nav className="mr-auto">
            <Navbar.Brand href="/vilius-profile/#/" className="text-primary">Home</Navbar.Brand>
            <Nav.Link href="/vilius-profile/#/projects" className="text-secondary">Projects</Nav.Link>
            <Nav.Link href="/vilius-profile/#/about-me" className="text-info">About Me</Nav.Link>
            <Nav.Link href="/vilius-profile/#/contacts" className="text-primary">Contacts</Nav.Link>
            <Nav.Link href="https://dev.to/vystartasv" className="text-primary">
              {'Blog '}
              <Figure.Image alt="Vilius's DEV Profile" height="16px" width="16px" src="https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg" />
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
