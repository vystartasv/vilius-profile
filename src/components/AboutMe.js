import React from 'react';
import { ListGroup } from 'react-bootstrap';
import AboutMeStack from './AboutMeStack';

export default class AboutMe extends React.Component {
  constructor() {
    super();
    this.state = {
      stack: ['JavaScript', 'Node.JS', 'React.JS', 'Bootstrap', 'Google App Engine', 'Firebase Firestore', 'Cloud Buckets stores',
        'MongoDB', 'WebStorm', 'Git', 'Visual Studio Code', 'Object Oriented programing (OOP)', 'Functional programing (FP)',
        'Data structures', 'Agile (Scrum)', 'And many more...'],
    };
  }

  render() {
    return (
      <AboutMeStack stack={this.state.stack} className="rounded" />
    );
  }
}
