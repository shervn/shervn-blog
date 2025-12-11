import { useEffect, useState, useRef, useMemo } from 'react';
import { Icon, Button, Segment, Grid, Loader } from 'semantic-ui-react';
import { timeAgo } from '../utils.js';

const BASE_API = 'https://11bv2r6dq0.execute-api.us-east-1.amazonaws.com';
const SPOTIFY_RECENT_API = `${BASE_API}/recent-tracks?limit=1`;
const CURRENTLY_PLAYING_API = `${BASE_API}/currently-playing`;
const PLAYER_API = `${BASE_API}/player`;
const TOGGLE_API = `${BASE_API}/toggle-state`;

export function MusicPlayer() {
  const [spotifyTrack, setSpotifyTrack] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const intervalRef = useRef(null);
  const refreshRef = useRef(null);

  const fetchData = async () => {
    try {
      const toggleRes = await fetch(TOGGLE_API).then(r => r.json());
      setShowButtons(toggleRes.state);
      const [spotifyRes, currentRes] = await Promise.all([
        fetch(SPOTIFY_RECENT_API).then(r => r.json()),
        fetch(CURRENTLY_PLAYING_API).then(r => r.json()),
      ]);

      setSpotifyTrack(spotifyRes[0] || null);
      setCurrentlyPlaying(
        currentRes?.message === 'No track currently playing' ? null : currentRes
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    refreshRef.current = setInterval(fetchData, 5000);
    return () => clearInterval(refreshRef.current);
  }, []);

  useEffect(() => {
    if (!currentlyPlaying) return;
    setProgress(currentlyPlaying.progress_ms);

    if (!currentlyPlaying?.is_playing) return;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + 50, currentlyPlaying.duration_ms);
        if (next >= currentlyPlaying.duration_ms) {
          setTimeout(async () => {
            try {
              const data = await fetch(CURRENTLY_PLAYING_API).then(r => r.json());
              setCurrentlyPlaying(data?.message === 'No track currently playing' ? null : data);
            } catch (err) {
              console.error(err);
            }
          }, 500);
        }
        return next;
      });
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
      const data = await fetch(CURRENTLY_PLAYING_API).then(r => r.json());
      setCurrentlyPlaying(data?.message === 'No track currently playing' ? null : data);
    } catch (err) {
      console.error(err);
    }
  }

  const track = currentlyPlaying || spotifyTrack;

  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Loader active indeterminate inline="centered" size="small" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!track) return null;

  return (
    <div className='musiclistening'>
      <p style={{ fontWeight: "bold" }}>
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

      {/* Only show player controls if toggle is true */}
      {currentlyPlaying && (
        <Segment basic style={{ padding: 0, margin: 0 }}>
          <Grid verticalAlign='middle'>
            <Grid.Row columns={3} textAlign='center' style={{ padding: 0 }}>
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
          {showButtons ? (
            <div style={{ display: 'flex', justifyContent: 'center', height:'3rem' }}>
          <Button
            className="always-visible"
            icon
            onClick={e => handlePlayerAction(e, 'previous')}
          >
            <Icon name='backward' />
          </Button>

          {currentlyPlaying?.is_playing ? (
            <Button
              className="always-visible"
              icon
              onClick={e => handlePlayerAction(e, 'pause')}
            >
              <Icon name='pause' />
            </Button>
          ) : (
            <Button
              className="always-visible"
              icon
              onClick={e => handlePlayerAction(e, 'play')}
            >
              <Icon name='play' />
            </Button>
)}

<Button
  className="always-visible"
  icon
  onClick={e => handlePlayerAction(e, 'next')}
>
  <Icon name='forward' />
</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', height:'3rem'}}><p></p></div>
          )}

        </Segment>
      )}
    </div>
  );
}
