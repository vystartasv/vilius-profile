import React from 'react';
import {Container, Nav} from "react-bootstrap";
// import { Link } from 'react-router-dom';

export default function ContactsStack(props) {
  return (
    <Container>
        <h1 className="display-5">My GitHub Profile is at the link bellow:</h1>
      <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="https://github.com/vystartasv">Thanks for checking it out:)</Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
}
