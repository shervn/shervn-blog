import { useEffect, useState } from 'react';
import { Header, Image, Modal, Icon, Button } from 'semantic-ui-react';
import { loadData, getImagePath } from '../utils.js';

const SPOTIY_RECENT_API = 'https://nibv576k3b.execute-api.us-east-1.amazonaws.com/spotify-latest'

export default function HeaderComponent() {
  const [metadata, setMetadata] = useState({});
  const [spotifyTrack, setSpotifyTrack] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load general metadata
  useEffect(() => {
    loadData(setMetadata, 'meta');
  }, []);

  useEffect(() => {
    async function fetchSpotifyTrack() {
      try {
        const res = await fetch(SPOTIY_RECENT_API);
        if (!res.ok) throw new Error('Failed to fetch track');
        const data = await res.json();
        setSpotifyTrack(data);
      } catch (err) {
        console.error(err);
        setSpotifyTrack({
          band: 'Radiohead',
          song: 'Morning Bell',
          url: 'https://open.spotify.com/track/4h37RgtBg9iynN3BIL5lFU?si=6d72e93e8ee54b15'
        });
      }
    }
    fetchSpotifyTrack();
  }, []);

  return (
    <div className="header-container">
      <Header className='headerText' as='h5' content=''/>
      <Image className='headerImage' src={getImagePath('blog_cover.png')} />

      {spotifyTrack && (
          <h5 className='musiclistening'>
            ♫ listening to  <a href={spotifyTrack.url}>{spotifyTrack.song}</a> by {spotifyTrack.band}
          </h5>
      )}

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
