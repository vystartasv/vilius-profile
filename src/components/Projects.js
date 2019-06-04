import React from 'react';
import { Container } from 'react-bootstrap';
import ProjectsStack from './ProjectsStack';

export default class Projects extends React.Component {
  constructor() {
    super();
    this.state = {
      projects: [
        {
          alt: 'screenshot of the project',
          img: 'team-main',
          name: 'Alpha Properties',
          live: 'https://alpha-properties-app.appspot.com',
          liveDesc: 'Live application on Google App Engine',
          github: 'https://github.com/kodiri/alpha-props',
          githubDesc: 'GitHub team repository here',
          description: 'This is a mock real estate agent website specialising around prime properties in central London.'
              + ' Project with React, Express.JS, integrated Google Maps API, implemented search, '
              + 'deployed on Google Cloud Platform uses Google App Engine and plain CSS.',
        },
        {
          alt: 'screenshot of the project',
          img: 'kodflix-project',
          name: 'Kodflix',
          live: 'https://kodflix-by-vilius.herokuapp.com',
          liveDesc: 'Live application on Heroku',
          github: 'https://github.com/vystartasv/kodflix',
          githubDesc: 'GitHub repository here',
          description: 'Movie show application. '
              + 'Project with React, Express.JS, MongoDB, Google Analytics and plain CSS. '
              + 'Please allow for a bit of time for the instance to wake up',
        },
      ],
    };
  }

  render() {
    return (
      <Container>
        <h1 className="display-3 card mb-4 shadow-sm rounded">My projects</h1>
        {this.state.projects.map(({
          alt, img, name, live, liveDesc, github, githubDesc, description,
        }) => (
          <ProjectsStack
            class="card mb-4 rounded"
            alt={alt}
            img={img}
            name={name}
            live={live}
            liveDesc={liveDesc}
            github={github}
            githubDesc={githubDesc}
            description={description}
          />
        ))}
      </Container>
    );
  }
}
