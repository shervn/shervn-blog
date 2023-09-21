import React, {Component} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

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
import Insta from './Components/instaComponent.js'

import { Menu } from 'semantic-ui-react'

const coverPhoto = require('./images/wall.jpeg')
function validatePathName(t){ return ['blog', 'insta', 'academia', 'recordings', 'videos', 'reviews'].indexOf(t.split('/')[1]) > 0 ? t.split('/')[1] : 'blog'};

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
          <Menu secondary pointing className='menu' widths={5} stackable>
            <Menu.Item as={Link} className="menuFarsi" to={'/reviews'}  name="reviews" content="reviews  |  نقد" active={this.state.activeItem === 'reviews'} onClick={this.handleItemClick} />
            {/* <Menu.Item as={Link} className="menuFarsi" to={'/insta'}  name="insta" content="instagram  |  اینستاگرام" active={this.state.activeItem === 'insta'} onClick={this.handleItemClick} /> */}
            <Menu.Item as={Link} className="menuFarsi" to={'/blog'}  name="blog" content='blog  |  بلاگ' active={this.state.activeItem === 'blog'} onClick={this.handleItemClick} />
            <Menu.Item as={Link} className="menuFarsi" to={'/music'}  name="music" content='music  |  موسیقی' active={this.state.activeItem === 'music'} onClick={this.handleItemClick}/>
            <Menu.Item as={Link} className="menuFarsi" to={'/videos'} name="videos" content='videos  |  ویدیو' active={this.state.activeItem === 'videos'} onClick={this.handleItemClick}/>
            <Menu.Item as={Link} className="menuFarsi" to={'/academia'} name="academia" content='academia  |  دانشگاه' active={this.state.activeItem === 'academia'} onClick={this.handleItemClick}/>
          </Menu>
        </div>
        <Routes>
          <Route path='/reviews' element={<Reviews/>} />
          <Route path='/insta' element={<Insta/>} />
          <Route path='/blog' element={<Blog/>} />
          <Route path='/music' element={<Music/>} />
          <Route path='/videos' element={<Video/>} />
          <Route path='/academia' element={<Academia/>} />
          <Route path='/' element={<Blog/>} />
        </Routes>
      </Router>
    <Footer/>
  </div>
</div>
  );
}
}
