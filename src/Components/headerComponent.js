import { useEffect, useState } from 'react';
import { Header, Image, Modal, Button, Icon } from 'semantic-ui-react';
import { loadData, getImagePath, timeAgo } from '../utils.js';

const SPOTIY_RECENT_API = 'https://11bv2r6dq0.execute-api.us-east-1.amazonaws.com/recent-tracks?limit=1'

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
        setSpotifyTrack(data[0]); // pick first track
      } catch (err) {
        console.error(err);
        // fallback is an object, not an array
        setSpotifyTrack({
          band: 'Radiohead',
          song: 'Morning Bell',
          url: 'https://open.spotify.com/track/4h37RgtBg9iynN3BIL5lFU?si=6d72e93e8ee54b15',
          listened_at: '2025-12-09T16:44:40.157Z'
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
        <div className='musiclistening'>
          <h5>
          <Icon name='headphones'/>Listening to <a className='song' href={spotifyTrack.url}>{spotifyTrack.song}</a> by <span className='band'>{spotifyTrack.band}</span>
          </h5>
          <p>{timeAgo(spotifyTrack.listened_at)}</p>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        basic
        size='tiny'
        style={{ padding: 0, textAlign: 'center' }}
      >
      <Image src={getImagePath('fozouni.jpg')} style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }} />
      <Button
        color='red'
        onClick={() => setModalOpen(false)}
        style={{ margin: '10px auto', display: 'block' }}
      >
        Close
      </Button>
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
