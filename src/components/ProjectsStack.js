import React from 'react';
import {Container, Figure, Nav} from "react-bootstrap";
// import { Link } from 'react-router-dom';

export default function ProjectsStack() {
  return (
      <Container>
        <Figure fluid>
          <Figure.Image
              width={500}
              alt="screenshot of the project"
              src={require(`./../common/images/kodflix-project.png`)}
          />
          <Figure.Caption className="lead">
            Kodflix project
          </Figure.Caption>
          <Nav className="justify-content-center" activeKey="/home">
            <Nav.Item>
              <Nav.Link href="https://kodflix-by-vilius.herokuapp.com">Live application</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="https://github.com/vystartasv/kodflix">GitHub repository here</Nav.Link>
            </Nav.Item>
          </Nav>
        </Figure>
      </Container>
  );
}
