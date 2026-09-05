import { useEffect, useState } from 'react';
import { Header, Modal } from 'semantic-ui-react';
import { loadData, getImagePath } from '../utils/general.js';
import { MusicPlayer } from './spotifyComponent.js';

const images = [
  "a.png",
  "b.png",
  "c.png",
  "d.png",
  "e.png",
  "f.png",
];

// t.png (the Tehran plate) is the one piece that stays fully visible and
// heartbeats - the rest sit static and nearly invisible.
const HEARTBEAT_IMAGE = "t.png";

// TEMPORARY - remove after 2026-09-13. The non-heartbeat images start at 70%
// opacity and fade linearly, day by day, down to 0 by the 13th, then stay there.
const TEMP_FADE_START = new Date('2026-09-05T00:00:00');
const TEMP_FADE_END = new Date('2026-09-13T00:00:00');
const TEMP_START_OPACITY = 0.7;

function tempFadingOpacity() {
  const now = new Date();
  if (now <= TEMP_FADE_START) return TEMP_START_OPACITY;
  if (now >= TEMP_FADE_END) return 0;
  const progress = (now - TEMP_FADE_START) / (TEMP_FADE_END - TEMP_FADE_START);
  return TEMP_START_OPACITY * (1 - progress);
}

const tempOtherImagesOpacity = tempFadingOpacity();

const HeaderImages = () => (
  <div className="headerContainer header-container-wrapper">
    {images.map((src, index) => (
      <img
        key={index}
        className="headerImage header-image-item"
        style={{ opacity: tempOtherImagesOpacity }}
        src={getImagePath(src, 'header')}
        alt={`Header ${index + 1}`}
      />
    ))}
    <img
      className="headerImage header-image-item active"
      src={getImagePath(HEARTBEAT_IMAGE, 'header')}
      alt="Header Tehran"
    />
  </div>
);

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
          <img src={getImagePath('fozouni.jpg', 'header')} className="header-modal-image" alt="Fozouni" />
          {metadata.fozouniCaption && (
            <p dir="rtl" className="header-modal-caption">{metadata.fozouniCaption}</p>
          )}
        </Modal.Content>
      </Modal>

      <div className="profile-row">
        <img src={getImagePath('profile.png', 'Misc')} id="profilepix" className="ui tiny circular image" alt="Profile" />
        <div className="profile-column">
          <img
            alt='asterisk'
            onClick={() => setModalOpen(true)}
            src={getImagePath('asterrisk.png', 'header')}
            className='asterisk-trigger rotate'
          />
          <Header className='headerText' as='h2' content={metadata.name} subheader={metadata.subtitle} />
        </div>
      </div>
    </div>
  );
}
