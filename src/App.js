import { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Menu } from 'semantic-ui-react';

import './App.css';

import HeaderComponent from './Components/headerComponent.js';
import Footer from './Components/footerComponent.js';
import Sound from './Components/soundComponent';
import Blog from './Components/blogComponent';
import TrainComponent from './Components/trainComponent.js';
import PhotoGrid from "./Components/postboxComponent.js";

import { data } from "./assets/postboxdata.js";
import { traindata } from "./assets/traindata.js";


function validatePathName(t) {
  return ['blog', 'reviews', 'postboxes', 'metro', 'noises'].includes(t.split('/')[1])
    ? t.split('/')[1]
    : 'blog';
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: validatePathName(window.location.pathname)
    };
  }

  handleItemClick = (_e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <HelmetProvider>
        <Helmet>
          <title>Shervin Dehghani *</title>
          <meta
            name="description"
            content="This is the personal webpage of Shervin Dehghani. شروین . صفحه شخصی."
          />
        </Helmet>
        <div id="mainContainer">
          <div id="header">
            <HeaderComponent alt="Shervin Dehghani cover" />
          </div>
          <Router>
            <div className="mainPageWithMenu">
              <Menu tabular widths={5} stackable>
                <Menu.Item
                  as={Link}
                  className="menuFarsi"
                  to={'/blog'}
                  name="blog"
                  content="Blog"
                  active={this.state.activeItem === 'blog'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  className="menuFarsi"
                  to={'/reviews'}
                  name="reviews"
                  content="Reviews"
                  active={this.state.activeItem === 'reviews'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  className="menuFarsi"
                  to={'/postboxes'}
                  name="postboxes"
                  content="Postboxes"
                  active={this.state.activeItem === 'postboxes'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  className="menuFarsi"
                  to={'/metro'}
                  name="metro"
                  content="مترو / Metro"
                  active={this.state.activeItem === 'metro'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  className="menuFarsi"
                  to={'/noises'}
                  name="noises"
                  content="Noises"
                  active={this.state.activeItem === 'noises'}
                  onClick={this.handleItemClick}
                />
              </Menu>
            </div>
            <Routes>
              <Route path="/blog" element={<Blog type="blog" />} />
              <Route path="/reviews" element={<Blog type="review" />} />
              <Route path="/postboxes" element={<PhotoGrid data={data} />} />
              <Route path="/metro" element={<TrainComponent data={traindata} />} />
              <Route path="/noises" element={<Sound />} />
              <Route path="*" element={<Navigate to="/blog" replace />} />
            </Routes>
          </Router>
          <Footer />
        </div>
      </HelmetProvider>
    );
  }
}
