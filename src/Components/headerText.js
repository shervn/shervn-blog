import { useEffect, useState } from 'react'
import { Header, Image, Modal, Icon, Button } from 'semantic-ui-react'
import { loadData, getImagePath } from '../utils.js';

const HeaderText = () => {
  const [metadata, setMetadata] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadData(setMetadata, 'meta');
  }, []);

  return (
    <div className="header-container">

      {/* Music Row */}
      <div className="music-row">
        <h5 className='musiclistening'>
          {metadata.musicprefix}
          <a href={metadata.musicurl}>{metadata.musictitle}</a> by {metadata.musicartist}
        </h5>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size='small'
      >
        <Header icon='asterisk' content='F. Fozouni' />
        <Modal.Content>
          <Image src={getImagePath('fozouni.jpg')} />
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={() => setModalOpen(false)}>
            <Icon name='close' /> Close
          </Button>
        </Modal.Actions>
      </Modal>

      {/* Profile + Text */}
      <div className="profile-row">

        <Image
          src={getImagePath('blog_profile.png')}
          id="profilepix"
          size='tiny'
          circular
        />

        <div className="profile-column">
          <img
            alt='asterisk'
            onClick={() => setModalOpen(true)}
            src={getImagePath('asterrisk.png')}
            className='asterisk-trigger rotate'
          />

          <Header
            className='headerText'
            as='h2'
            content={metadata.name}
            subheader={metadata.subtitle}
          />
        </div>

      </div>

    </div>
  );
};

export default HeaderText;
