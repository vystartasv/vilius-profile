import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

export default function AboutMeStack(props) {
  return (
    <Container flush className="bg-light rounded">
      <h1>Languages and frameworks I am working on</h1>
      <ListGroup>
        <ListGroup.Item>JavaScript</ListGroup.Item>
        <ListGroup.Item>Node.js</ListGroup.Item>
        <ListGroup.Item>React.JS</ListGroup.Item>
        <ListGroup.Item>Bootstrap</ListGroup.Item>
      </ListGroup>
    </Container>
  );
}
