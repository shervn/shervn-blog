import { useEffect, useState, useRef, useMemo } from 'react';
import { Header, Image, Modal, Icon, Button, Segment, Grid } from 'semantic-ui-react';
import { loadData, getImagePath, timeAgo } from '../utils.js';

const BASE_API = 'https://11bv2r6dq0.execute-api.us-east-1.amazonaws.com';
const SPOTIFY_RECENT_API = `${BASE_API}/recent-tracks?limit=1`;
const CURRENTLY_PLAYING_API = `${BASE_API}/currently-playing`;
const PLAYER_API = `${BASE_API}/player`;

export default function HeaderComponent() {
  const [metadata, setMetadata] = useState({});
  const [spotifyTrack, setSpotifyTrack] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => { loadData(setMetadata, 'meta'); }, []);

  useEffect(() => {
    async function fetchSpotifyTrack() {
      try {
        const res = await fetch(SPOTIFY_RECENT_API);
        if (!res.ok) throw new Error('Failed to fetch track');
        const data = await res.json();
        setSpotifyTrack(data[0]);
      } catch (err) {
        console.error(err);
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

  useEffect(() => {
    async function fetchCurrentlyPlaying() {
      try {
        const res = await fetch(CURRENTLY_PLAYING_API);
        const data = await res.json();
        setCurrentlyPlaying(data?.message === 'No track currently playing' ? null : data);
      } catch (err) {
        console.error(err);
        setCurrentlyPlaying(null);
      }
    }
    fetchCurrentlyPlaying();
  }, []);

  useEffect(() => {
    if (!currentlyPlaying) return;
    setProgress(currentlyPlaying.progress_ms);
    if (!currentlyPlaying?.is_playing) return;
    intervalRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + 50, currentlyPlaying.duration_ms));
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [currentlyPlaying]);

  const percent = useMemo(() => {
    if (!currentlyPlaying?.duration_ms) return 0;
    return (progress / currentlyPlaying.duration_ms) * 100;
  }, [progress, currentlyPlaying]);

  const formatTime = (ms) => {
    if (!ms && ms !== 0) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const handlePlayerAction = async (e, action) => {
    e.currentTarget.blur();
    try {
      await fetch(`${PLAYER_API}?action=${action}`);
      const res = await fetch(CURRENTLY_PLAYING_API);
      const data = await res.json();
      setCurrentlyPlaying(data?.message === 'No track currently playing' ? null : data);
    } catch (err) {
      console.error(err);
    }
  };

  const track = currentlyPlaying || spotifyTrack;
  if (!track) return null;

  return (
    <div className="header-container">
      <Header className='headerText' as='h5' content=''/>
      <Image className='headerImage' src={getImagePath('blog_cover.png')} />

      <div basic className='musiclistening'>
        <p style={{fontWeight: "bold"}}>
        <Icon name='headphones' />
          Listening to{' '}
          <a className='song' href={track.url} target="_blank" rel="noreferrer">
            {track.song}
          </a>{' '}
          by <span className='band'>{track.artist || track.band}</span>
        </p>
        <p>
          {currentlyPlaying
            ? currentlyPlaying.is_playing
              ? 'currently playing'
              : '(paused)'
            : track.listened_at
              ? timeAgo(track.listened_at)
              : ''}
        </p>

                </div>
        <div>

        {currentlyPlaying && (
          <Segment basic style={{ padding: 0, margin:0}}>
            <Grid verticalAlign='middle'>
              <Grid.Row columns={3} textAlign='center' style={{padding: 0}}>
                <Grid.Column width={2} textAlign='right'>{formatTime(progress)}</Grid.Column>
                <Grid.Column width={12}>
                  <div style={{
                    position: 'relative',
                    height: '4px',
                    backgroundColor: '#ddd',
                    borderRadius: '2px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${percent}%`,
                      height: '100%',
                      backgroundColor: '#000',
                      borderRadius: '2px',
                      transition: 'width 0.4s linear'
                    }} />
                  </div>
                </Grid.Column>
                <Grid.Column width={2} textAlign='left'>{formatTime(currentlyPlaying.duration_ms)}</Grid.Column>
              </Grid.Row>
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'center'}}>
              <Button inverted icon onClick={e => {handlePlayerAction(e, 'previous')}}>
                <Icon name='backward' />
              </Button>
              <Button inverted icon onClick={e => {handlePlayerAction(e, 'pause')}}>
                <Icon name='pause' />
              </Button>
              <Button inverted icon onClick={e => {handlePlayerAction(e, 'play')}}>
                <Icon name='play' />
              </Button>
              <Button inverted icon onClick={e => {handlePlayerAction(e, 'next')}}>
                <Icon name='forward' />
              </Button>
            </div>
          </Segment>
        )}
      </div>

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
};
