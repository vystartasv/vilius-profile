import React, { useState } from 'react';
import { Container, Nav, Button } from 'react-bootstrap';


export default function ContactsStack({ contacts }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Container className="bg-light rounded p-4">
      {contacts.map(({ link, label }) => <ContactLinks className='p-5' link={link} label={label} />)}
      {
          !isVisible
            ? (
              <Button
                className="btn btn-lg btn-primary"
                onClick={() => setIsVisible(!isVisible)}
              >
              Show email
              </Button>
            )
            : null
      }
      {isVisible ? (
        <a href="mailto:vilius.vystartas@gmail.com?
        subject=Vilius%2C%20I%20stumbled%20upon%20your%20portfolio%20and%20I%20would%20like%20to%20contact%20you&amp;
        body=Hi%20Vilius%2C%0A%0AI%20am%20...%20and%20I%20would%20like%20to%20..."
           className='display-3 text-main m-4'
        >
          vilius.vystartas@gmail.com
        </a>
      )
        : <></>}
    </Container>
  );
}

function ContactLinks({link, label }) {
  return (
    <>
      <Nav className="justify-content-center display-3">
        <Nav.Item>
          <a href={link}>{label}</a>
        </Nav.Item>
      </Nav>
    </>
  );
}
