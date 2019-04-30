import React from 'react';
import {Container, Nav} from "react-bootstrap";
// import { Link } from 'react-router-dom';

export default function ContactsStack(props) {
  return (
    <Container>
      <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="https://github.com/vystartasv">My Github profile is here</Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
}
