import { Component } from 'react';
import { Divider, Menu } from 'semantic-ui-react';
import { BrowserRouter as Router, Link, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import './styles/App.css';

import HeaderComponent from './Components/headerComponent.js';
import Footer from './Components/footerComponent.js';
import Blog from './Components/blogComponent.js';
import TrainComponent from './Components/trainComponent.js';
import PhotoGrid from "./Components/postboxComponent.js";
import MusicStatComponent from "./Components/musicStatComponent.js";
import SinglePost from './Components/singlePostComponent.js';
import RouteTransition from './Components/routeTransition.js';


function validatePathName(t) {
  return ['blog', 'reviews', 'postboxes', 'metro', 'noises', 'spotify'].includes(t.split('/')[1])
    ? t.split('/')[1]
    : 'postboxes';
}

const SingleItemWrapper = () => {
  const { type, uuid } = useParams();
  return <SinglePost type={type} uuid={uuid} />;
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: validatePathName(window.location.pathname),
    };
  }

  handleItemClick = (_e, { name }) => {
    this.setState({ 
      activeItem: name
    });
  };

  render() {
    return (
      <HelmetProvider>
        <Helmet>
          <title>shervn - Personal Blog</title>
          <meta
            name="description"
            content="Personal webpage of Shervin Dehghani. Blog posts, reviews, photography, and music. شروین . صفحه شخصی."
          />
          <meta name="keywords" content="shervin, blog, photography, music, portfolio" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="shervn" />
          <link rel="canonical" href="https://shervn.com" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Shervin Dehghani",
              "url": "https://shervn.com",
              "sameAs": []
            })}
          </script>
        </Helmet>
        <div id="mainContainer">
          <div id="header">
            <HeaderComponent alt="Shervin cover" />
          </div>
          <Router>
            <nav className="mainPageWithMenu" role="navigation" aria-label="Main navigation">
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
                    aria-label={`Navigate to ${item}`}
                  />
                ))}
              </Menu>
              <Divider />
            </nav>
            <RouteTransition>
              <Routes>
                <Route path="/blog" element={<Navigate to="/blog/page/1" replace />} />
                <Route path="/blog/page/:page" element={<Blog type="blog" />} />
                <Route path="/reviews" element={<Navigate to="/reviews/page/1" replace />} />
                <Route path="/reviews/page/:page" element={<Blog type="review" />} />
                <Route path="/postboxes" element={<PhotoGrid/>} />
                <Route path="/metro" element={<TrainComponent/>} />
                <Route path="/noises" element={<Navigate to="/noises/page/1" replace />} />
                <Route path="/noises/page/:page" element={<Blog type="noises" />} />
                <Route path="/spotify" element={<MusicStatComponent />} />

                <Route path="/:type/:uuid" element={<SingleItemWrapper />} />

                <Route path="*" element={<Navigate to="/postboxes" replace />} />
              </Routes>
            </RouteTransition>
          </Router>
          <Footer />
        </div>
      </HelmetProvider>
    );
  }
}
