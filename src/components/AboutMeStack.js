import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

export default function AboutMeStack(props) {
  return (
    <Container flush className="bg-light rounded auto">
      <h1>Languages, frameworks, services, concepts, tools and methodologies I am good with</h1>
      <ListGroup>
        {props.stack.map(item => <ListGroup.Item>{item}</ListGroup.Item>)}
      </ListGroup>
    </Container>
  );
}
