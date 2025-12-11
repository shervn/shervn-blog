import { useEffect, useState } from 'react';
import { Header, Image, Modal, Button} from 'semantic-ui-react';
import { loadData, getImagePath } from '../utils.js';
import { MusicPlayer } from './spotifyComponent.js'


const images = [
  "Header/a.png",
  "Header/b.png",
  "Header/c.png",
  "Header/d.png",
  "Header/e.png",
  "Header/f.png",
];

const HeaderImages = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
      <div
        className="headerContainer"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1280 / 909",
          overflow: "hidden",
        }}
      >
        {images.map((src, index) => (
          <Image
            key={index}
            className="headerImage"
            src={getImagePath(src)}
            style={{
              opacity: index === activeIndex ? 1 : 0.65,
              transition: "opacity 2.0s ease-in-out, transform 2.0s ease-in-out",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: index === activeIndex ? "scale(1.003)" : "scale(1)",
            }}
          />
        ))}
      </div>
  );
};

export default function HeaderComponent() {
  const [metadata, setMetadata] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { loadData(setMetadata, 'meta'); }, []);

  return (
    <div className="header-container">
      <Header className='headerText' as='h5' content='' />
      <HeaderImages/>
      <MusicPlayer />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        basic
        size='tiny'
        style={{ padding: 0, textAlign: 'center' }}
      >
        <Image src={getImagePath('fozouni.jpg')} style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }} />
        <Button color='red' onClick={() => setModalOpen(false)} style={{ margin: '10px auto', display: 'block' }}>Close</Button>
      </Modal>

      <div className="profile-row">
        <Image src={getImagePath('blog_profile.png')} id="profilepix" size='tiny' circular />
        <div className="profile-column">
          <img
            alt='asterisk'
            onClick={() => setModalOpen(true)}
            src={getImagePath('asterrisk.png')}
            className='asterisk-trigger rotate'
          />
          <Header className='headerText' as='h2' content={metadata.name} subheader={metadata.subtitle} />
        </div>
      </div>
    </div>
  );
}
