import React from 'react';
import {
  Container, Figure, Nav, Row, Col,
} from 'react-bootstrap';

export default function ProjectsStack({
  images, live, liveDesc, github, githubDesc, description
}) {
  return (
    <Row className="justify-content-md-center bg-light rounded">
      <Col md="auto">
        <Figure fluid className="shadow">
          <h2 className='display-4'>{images[0].name} project</h2>
          {images.map(({alt, img, name}) => (
              <>
             <Figure.Image width={1000} alt={alt} src={require(`./../common/images/${img}.jpg`)} />
             <Figure.Caption className="lead">{name}</Figure.Caption>
              </>))}
          <Nav className="justify-content-center" activeKey="/home">
            <Nav.Item>
              <Nav.Link href={live}>{liveDesc}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href={github}>{githubDesc}</Nav.Link>
            </Nav.Item>
          </Nav>
          <p>{description}</p>
        </Figure>
      </Col>
    </Row>
  );
}
