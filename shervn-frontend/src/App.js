import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import {Helmet} from 'react-helmet'

import './App.css';

import HeaderImage from './Components/headerImage'
import HeaderText from './Components/headerText'
import Footer from './Components/footer'
import Music from './Components/musicComponent'
import Blog from './Components/blogComponent'
import Academia from './Components/academiaComponent.js'
import Reviews from './Components/reviewsComponent.js'
import Video from './Components/videosComponent.js'

// import AboutMe from './Components/aboutMeComponent'

import { Menu } from 'semantic-ui-react'

const coverPhoto = require('./images/coverVI.jpg')
function validatePathName(t){ return ['blog', 'academia', 'recordings', 'videos', 'reviews'].indexOf(t.split('/')[1]) > 0 ? t.split('/')[1] : 'blog'};

export default class App extends Component {

  constructor(props){
    super(props);
    this.state  = {
      activeItem:  validatePathName(window.location.pathname)
    };
  };

handleItemClick = (e, { name }) => this.setState({ activeItem: name })

render() {
  return (
    <div>
  <Helmet>
    <title>Shervin Dehghani *</title>
    <meta name="description" content="This is the personal webpage of Shervin Dehghani.   شروین دهقانی. صفحه شخصی." />
  </Helmet>
  <div id="mainContainer">
    <div id="header" bordered>
      <HeaderImage image={coverPhoto} alt="Shervin Dehghani cover" border="True"/>
      <HeaderText/>
    </div>
    <Router>
        <div className="mainPageWithMenu">
          <Menu className='menu' fluid borderless widths={5}>
            <Menu.Item as={Link} to={'/reviews'}  name='reviews' active={this.state.activeItem === 'reviews'} onClick={this.handleItemClick} />
            <Menu.Item as={Link} to={'/blog'}  name='blog' active={this.state.activeItem === 'blog'} onClick={this.handleItemClick} />
            <Menu.Item as={Link} to={'/recordings'}  name='recordings' active={this.state.activeItem === 'recordings'} onClick={this.handleItemClick}/>
            <Menu.Item as={Link} to={'/videos'} name='videos' active={this.state.activeItem === 'videos'} onClick={this.handleItemClick}/>
            <Menu.Item as={Link} to={'/academia'} name='academia' active={this.state.activeItem === 'academia'} onClick={this.handleItemClick}/>
          </Menu>
        </div>
        <Switch>
          <Route path='/reviews' component={Reviews} />
          <Route path='/blog' component={Blog} />
          <Route path='/recordings' component={Music} />
          <Route path='/videos' component={Video} />
          <Route path='/academia' component={Academia} />
          <Route path='/' component={Blog} />
        </Switch>
      </Router>
    <Footer/>
  </div>
</div>
  );
}
}
