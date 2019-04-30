import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './components/Home';
import Projects from './components/Projects';
import AboutMe from './components/AboutMe';
import Contacts from './components/Contacts';
import Menu from './components/Menu';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">

          <Container fluid>
            <Menu />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/projects" component={Projects} />
              <Route exact path="/contacts" component={Contacts} />
              <Route exact path="/about-me" component={AboutMe} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
