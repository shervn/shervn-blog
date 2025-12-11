import { Component } from 'react';
import { Divider, Menu } from 'semantic-ui-react';
import { BrowserRouter as Router, Link, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import './App.css';

import HeaderComponent from './Components/headerComponent.js';
import Footer from './Components/footerComponent.js';
import Sound from './Components/soundComponent';
import Blog from './Components/blogComponent';
import TrainComponent from './Components/trainComponent.js';
import PhotoGrid from "./Components/postboxComponent.js";
import MusicStatComponent from "./Components/musicStatComponent.js";
import SinglePost from './Components/singlePostComponent.js';

import { data } from "./assets/postboxdata.js";
import { traindata } from "./assets/traindata.js";


function validatePathName(t) {
  return ['blog', 'reviews', 'postboxes', 'metro', 'noises', 'spotify'].includes(t.split('/')[1])
    ? t.split('/')[1]
    : 'postboxes';
}

// Wrapper component to extract type and uuid from URL params
const SingleItemWrapper = () => {
  const { type, uuid } = useParams();
  return <SinglePost type={type} uuid={uuid} />;
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: validatePathName(window.location.pathname),
      clickSequence: [],
    };
  }

  handleItemClick = (_e, { name }) => {
    const { clickSequence } = this.state;

    const updatedSequence = [...clickSequence, name].slice(-5);
    this.setState({ 
      activeItem: name,
      clickSequence: updatedSequence
    }, () => {
      if (updatedSequence.join(',') === 'blog,spotify,blog,spotify,reviews') {
        fetch('https://11bv2r6dq0.execute-api.us-east-1.amazonaws.com/toggle', {
          method: 'GET'
        })
        .then(res => console.log(''))
        .catch(err => console.error(''));
      }
    });
  };

  render() {
    return (
      <HelmetProvider>
        <Helmet>
          <title>shervn</title>
          <meta
            name="description"
            content="This is the personal webpage of Shervin. شروین . صفحه شخصی."
          />
        </Helmet>
        <div id="mainContainer">
          <div id="header">
            <HeaderComponent alt="Shervin cover" />
          </div>
          <Router>
            <div className="mainPageWithMenu">
              <Menu secondary widths={6} stackable>
                {['blog','reviews','postboxes','metro','noises','spotify'].map((item) => (
                  <Menu.Item
                    key={item}
                    as={Link}
                    className="menuFarsi"
                    to={`/${item}`}
                    name={item}
                    content={item.charAt(0).toUpperCase() + item.slice(1)}
                    active={this.state.activeItem === item}
                    onClick={this.handleItemClick}
                  />
                ))}
              </Menu>
              <Divider />
            </div>
            <Routes>
              <Route path="/blog" element={<Blog type="blog" />} />
              <Route path="/reviews" element={<Blog type="review" />} />
              <Route path="/postboxes" element={<PhotoGrid data={data} />} />
              <Route path="/metro" element={<TrainComponent data={traindata} />} />
              <Route path="/noises" element={<Sound />} />
              <Route path="/spotify" element={<MusicStatComponent />} />

              {/* Single post/item route */}
              <Route path="/:type/:uuid" element={<SingleItemWrapper />} />

              <Route path="*" element={<Navigate to="/postboxes" replace />} />
            </Routes>
          </Router>
          <Footer />
        </div>
      </HelmetProvider>
    );
  }
}
