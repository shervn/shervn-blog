import React, { Component, useEffect, useRef } from 'react';
import { Divider, Icon, Menu } from 'semantic-ui-react';
import { BrowserRouter as Router, Link, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { pastelColorForIndex } from './utils/general.js';

import './styles/App.css';

import HeaderComponent from './Components/headerComponent.js';
import Footer from './Components/footerComponent.js';
import Blog from './Components/blogComponent.js';
import TrainComponent from './Components/trainComponent.js';
import PhotoGrid from "./Components/postboxComponent.js";
import MusicStatComponent from "./Components/musicStatComponent.js";
import ScholarComponent from "./Components/scholarComponent.js";
import SinglePost from './Components/singlePostComponent.js';
import RouteTransition from './Components/routeTransition.js';


const NAV_ITEMS = ['blog', 'reviews', 'postboxes', 'metro', 'noises', 'listening', 'research'];

function validatePathName(t) {
  return NAV_ITEMS.includes(t.split('/')[1])
    ? t.split('/')[1]
    : 'postboxes';
}

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 19;

function isDaytime() {
  const hour = new Date().getHours();
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR;
}

function getInitialTheme() {
  return isDaytime() ? 'light' : 'dark';
}

const SingleItemWrapper = () => {
  const { type, uuid } = useParams();
  return <SinglePost type={type} uuid={uuid} />;
};

const SITE_URL = 'https://shervn.com';

// Dynamic canonical/og:url per route, so every page (including individual
// posts) declares its own real URL instead of every page pointing at the
// homepage.
const RouteSeo = () => {
  const location = useLocation();
  const url = `${SITE_URL}${location.pathname}`;
  return (
    <Helmet>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
};

// Redirect-only routes that immediately navigate elsewhere - skip firing a
// page_view for these so a visit to e.g. /blog doesn't double-count as both
// /blog and /blog/page/1.
const PAGE_VIEW_SKIP_PATHS = new Set(['/blog', '/reviews', '/noises']);

const PageViewTracker = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const pathRef = useRef(currentPath);
  const startRef = useRef(Date.now());

  const reportTimeSpent = () => {
    if (!window.gtag) return;
    const engagementTimeMs = Date.now() - startRef.current;
    if (engagementTimeMs <= 0) return;
    window.gtag('event', 'page_time_spent', {
      page_path: pathRef.current,
      engagement_time_msec: engagementTimeMs,
    });
  };

  useEffect(() => {
    // Transient redirect-only paths (e.g. /reviews on its way to
    // /reviews/page/1) render for a moment mid-navigation. Ignore them
    // entirely rather than treating that instant as its own page visit -
    // the timer keeps running from whatever page the user was actually on.
    if (PAGE_VIEW_SKIP_PATHS.has(location.pathname)) {
      return;
    }

    if (pathRef.current !== currentPath) {
      reportTimeSpent();
      pathRef.current = currentPath;
      startRef.current = Date.now();
    }

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: currentPath,
        page_title: document.title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportTimeSpent();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: validatePathName(window.location.pathname),
      theme: getInitialTheme(),
    };
  }

  componentDidMount() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
  }

  handleItemClick = (_e, { name }) => {
    this.setState({
      activeItem: name
    });
  };

  toggleTheme = () => {
    this.setState(({ theme }) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      return { theme: next };
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
          <meta property="og:image" content="https://shervn-blog-media.s3.amazonaws.com/images/Misc/profile.png" />
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
        <button
          type="button"
          className="theme-toggle"
          onClick={this.toggleTheme}
          aria-label={this.state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={this.state.theme === 'dark'}
        >
          <Icon name={this.state.theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <div id="mainContainer">
          <div id="header">
            <HeaderComponent alt="Shervin cover" />
          </div>
          <Router>
            <RouteSeo />
            <PageViewTracker />
            <nav className="mainPageWithMenu" role="navigation" aria-label="Main navigation">
              <Menu secondary widths={7} stackable>
                {NAV_ITEMS.map((item, index) => (
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
                    style={{ '--nav-pastel': pastelColorForIndex(index) }}
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
                <Route path="/listening" element={<MusicStatComponent />} />
                <Route path="/research" element={<ScholarComponent />} />

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
