import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

export default function AboutMeStack(props) {
  return (
    <Container flush className="bg-light rounded auto">
      <h1>Languages, frameworks, services, concepts, tools and methodologies I am good with</h1>
      <ListGroup>
        <ListGroup.Item>JavaScript</ListGroup.Item>
        <ListGroup.Item>Node.JS</ListGroup.Item>
        <ListGroup.Item>React.JS</ListGroup.Item>
        <ListGroup.Item>Bootstrap</ListGroup.Item>
        <ListGroup.Item>Google App Engine</ListGroup.Item>
        <ListGroup.Item>Firebase Firestore</ListGroup.Item>
        <ListGroup.Item>Cloud Buckets stores</ListGroup.Item>
        <ListGroup.Item>MongoDB</ListGroup.Item>
          <ListGroup.Item>WebStorm</ListGroup.Item>
          <ListGroup.Item>Git</ListGroup.Item>
          <ListGroup.Item>Visual Studio Code</ListGroup.Item>
          <ListGroup.Item>Object Oriented programing (OOP)</ListGroup.Item>
          <ListGroup.Item>Functional programing (FP)</ListGroup.Item>
          <ListGroup.Item>Data structures</ListGroup.Item>
          <ListGroup.Item>Agile (Scrum)</ListGroup.Item>
          <ListGroup.Item>And many more...</ListGroup.Item>
      </ListGroup>
    </Container>
  );
}
