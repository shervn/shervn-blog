import { useEffect, useState } from 'react';
import { Header, Image, Modal, Button} from 'semantic-ui-react';
import { loadData, getImagePath } from '../utils.js';
import { MusicPlayer } from './spotifyComponent.js'

export default function HeaderComponent() {
  const [metadata, setMetadata] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { loadData(setMetadata, 'meta'); }, []);

  return (
    <div className="header-container">
      <Header className='headerText' as='h5' content='' />
      <Image className='headerImage' src={getImagePath('blog_cover.png')} />

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
