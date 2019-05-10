import React from 'react';
import {
  Container, Figure, Nav, Row, Col,
} from 'react-bootstrap';

export default function ProjectsStack() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Figure fluid className="shadow">
            <Figure.Image
              width={1000}
              alt="screenshot of the project"
              src={require('./../common/images/kodflix-project.png')}
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
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Figure fluid className="shadow">
            <Figure.Image
              width={1000}
              alt="screenshot of the project"
              src={require('./../common/images/react-forced-render.png')}
            />
            <Figure.Caption className="lead text-primary">
              React forced render project
            </Figure.Caption>
            <Nav className="justify-content-center" activeKey="/home">
              <Nav.Item>
                <Nav.Link href="https://github.com/vystartasv/react-forced-render">GitHub repository here</Nav.Link>
              </Nav.Item>
            </Nav>
          </Figure>
        </Col>
      </Row>
    </Container>
  );
}
