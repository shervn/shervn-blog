import { useEffect, useState } from 'react';
import { Header, Image, Modal } from 'semantic-ui-react';
import { loadData, getImagePath } from '../utils/general.js';
import { MusicPlayer } from './spotifyComponent.js';
import { HEADER_IMAGE_INTERVAL } from '../utils/constants.js';

const images = [
  "a.png",
  "b.png",
  "c.png",
  "d.png",
  "e.png",
  "f.png",
];

const HeaderImages = () => {
  const [activeIndices, setActiveIndices] = useState(new Set([0]));

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly select 1-3 images to be active
      const numActive = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 active images
      const newActiveIndices = new Set();
      
      // Randomly select indices
      while (newActiveIndices.size < numActive) {
        const randomIndex = Math.floor(Math.random() * images.length);
        newActiveIndices.add(randomIndex);
      }
      
      setActiveIndices(newActiveIndices);
    }, HEADER_IMAGE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="headerContainer header-container-wrapper">
        {images.map((src, index) => (
          <Image
            key={index}
            className={`headerImage header-image-item ${activeIndices.has(index) ? 'active' : ''}`}
            src={getImagePath(src, 'Header')}
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
        className="header-modal"
      >
        <Modal.Content onClick={() => setModalOpen(false)}>
          <Image src={getImagePath('fozouni.jpg', 'Misc')} className="header-modal-image" />
        </Modal.Content>
      </Modal>

      <div className="profile-row">
        <Image src={getImagePath('blog_profile.png', 'Misc')} id="profilepix" size='tiny' circular />
        <div className="profile-column">
          <img
            alt='asterisk'
            onClick={() => setModalOpen(true)}
            src={getImagePath('asterrisk.png', 'Misc')}
            className='asterisk-trigger rotate'
          />
          <Header className='headerText' as='h2' content={metadata.name} subheader={metadata.subtitle} />
        </div>
      </div>
    </div>
  );
}
