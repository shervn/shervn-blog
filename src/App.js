import React, {Component} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import './App.css';

import HeaderImage from './Components/headerImage'
import HeaderText from './Components/headerText'
import Footer from './Components/footer'
import Sound from './Components/soundComponent'
import Blog from './Components/blogComponent'
import Reviews from './Components/reviewsComponent.js'
// import Insta from './Components/instaComponent.js'
// import Research from './Components/researchComponent.js'
// import Video from './Components/videosComponent.js'

import PhotoGrid from "./Components/postboxes.js";
import { data } from "./assets/postboxdata.js"


import { Menu } from 'semantic-ui-react'

function validatePathName(t){ return ['blog', 'reviews', 'postboxes', 'sound'].indexOf(t.split('/')[1]) > 0 ? t.split('/')[1] : 'blog'};

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
    <HelmetProvider>
  <Helmet>
    <title>Shervin Dehghani *</title>
    <meta name="description" content="This is the personal webpage of Shervin Dehghani.   شروین دهقانی. صفحه شخصی." />
  </Helmet>
  <div id="mainContainer">
    <div id="header" >
      <HeaderImage alt="Shervin Dehghani cover"/>
      <HeaderText/>
    </div>
    <Router>
        <div className="mainPageWithMenu">
          <Menu secondary pointing className='menu' widths={4} stackable>
            <Menu.Item as={Link} className="menuFarsi" to={'/blog'}  name="blog" content='blog' active={this.state.activeItem === 'blog'} onClick={this.handleItemClick} />
            <Menu.Item as={Link} className="menuFarsi" to={'/reviews'} name="reviews" content='reviews' active={this.state.activeItem === 'reviews'} onClick={this.handleItemClick}/>
            <Menu.Item as={Link} className="menuFarsi" to={'/postboxes'}  name="postboxes" content='postboxes' active={this.state.activeItem === 'postboxes'} onClick={this.handleItemClick}/>
            <Menu.Item as={Link} className="menuFarsi" to={'/noises'} name="noises" content='noises' active={this.state.activeItem === 'noises'} onClick={this.handleItemClick}/>
            {/* <Menu.Item as={Link} className="menuFarsi" to={'/reviews'}  name="reviews" content="reviews" active={this.state.activeItem === 'reviews'} onClick={this.handleItemClick} /> */}
            {/* <Menu.Item as={Link} className="menuFarsi" to={'/research'} name="research" content='research' active={this.state.activeItem === 'research'} onClick={this.handleItemClick}/> */}
          </Menu>
        </div>
        <Routes>
          <Route path='/blog' element={<Blog/>} />
          <Route path='/reviews' element={<Reviews/>} />
          <Route path='/postboxes' element={<PhotoGrid data={data}/>} />
          <Route path='/noises' element={<Sound/>} />
          {/* <Route path='/videos' element={<Video/>} /> */}
          {/* <Route path='/research' element={<Research/>} /> */}
          <Route path='/' element={<Blog/>} />
        </Routes>
      </Router>
    <Footer/>
  </div>
</HelmetProvider>
  );
}
}
