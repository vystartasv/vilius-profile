import React from 'react';
import { Container, Nav } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

export default function ContactsStack(props) {
  return (
    <Container className="bg-light rounded">
      <h1 className="display-5">Linkedin</h1>
      <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="https://www.linkedin.com/in/vystartas/">Link to Linkedin</Nav.Link>
        </Nav.Item>
      </Nav>
        <h1 className="display-5">Github</h1>
        <Nav className="justify-content-center" activeKey="/home">
            <Nav.Item>
                <Nav.Link href="https://github.com/vystartasv">Link to Github</Nav.Link>
            </Nav.Item>
        </Nav>
    </Container>
  );
}
