import { useEffect, useState, useRef, useMemo } from 'react';
import { Icon, Button, Segment, Grid, Loader } from 'semantic-ui-react';
import { timeAgo } from '../utils/general.js';
import {
  getToggleState,
  getRecentTracks,
  getCurrentlyPlaying,
  controlPlayer
} from '../utils/lambdaUtils.js';
import {
  SPOTIFY_REFRESH_INTERVAL,
  SPOTIFY_PROGRESS_UPDATE_INTERVAL,
  SPOTIFY_TRACK_CHECK_DELAY
} from '../utils/constants.js';

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
      const toggleRes = await getToggleState();
      setShowButtons(toggleRes.state);
      const [spotifyRes, currentRes] = await Promise.all([
        getRecentTracks(1),
        getCurrentlyPlaying(),
      ]);

      setSpotifyTrack(spotifyRes[0] || null);
      setCurrentlyPlaying(currentRes);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    refreshRef.current = setInterval(fetchData, SPOTIFY_REFRESH_INTERVAL);
    return () => clearInterval(refreshRef.current);
  }, []);

  useEffect(() => {
    if (!currentlyPlaying) return;
    setProgress(currentlyPlaying.progress_ms);

    if (!currentlyPlaying?.is_playing) return;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + SPOTIFY_PROGRESS_UPDATE_INTERVAL, currentlyPlaying.duration_ms);
        if (next >= currentlyPlaying.duration_ms) {
          setTimeout(async () => {
            try {
              const data = await getCurrentlyPlaying();
              setCurrentlyPlaying(data);
            } catch (err) {
              console.error(err);
            }
          }, SPOTIFY_TRACK_CHECK_DELAY);
        }
        return next;
      });
    }, SPOTIFY_PROGRESS_UPDATE_INTERVAL);

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
      const data = await controlPlayer(action);
      setCurrentlyPlaying(data);
    } catch (err) {
      console.error(err);
    }
  }

  const track = currentlyPlaying || spotifyTrack;

  if (loading) {
    return (
      <div className="spotify-loading">
        <Loader active indeterminate inline="centered" size="small" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!track) return null;

  return (
    <div className='musiclistening'>
      <p className="spotify-bold-text">
        <Icon name='headphones' />
        Listening to{' '}
        <a className='song' href={track.url} target="_blank" rel="noreferrer">
          {track.song}
        </a>{' '}
        by <span className='band'>{track.artist || track.band}</span>
      </p>
      <p className="spotify-listened-at">
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
        <Segment basic className="spotify-player-segment" role="region" aria-label="Spotify player">
          <Grid verticalAlign='middle'>
            <Grid.Row columns={3} textAlign='center' className="spotify-player-row">
              <Grid.Column className="spotify-start-stop-time" width={2} textAlign='right' aria-label={`Current time: ${formatTime(progress)}`}>{formatTime(progress)}</Grid.Column>
              <Grid.Column width={12}>
                <div 
                  className="spotify-progress-container"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`Progress: ${percent}%`}
                >
                  <div 
                    className="spotify-progress-bar"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </Grid.Column>
              <Grid.Column className="spotify-start-stop-time" width={2} textAlign='left' aria-label={`Total duration: ${formatTime(currentlyPlaying.duration_ms)}`}>{formatTime(currentlyPlaying.duration_ms)}</Grid.Column>
            </Grid.Row>
          </Grid>
          {showButtons ? (
            <div className="spotify-controls" role="group" aria-label="Player controls">
          <Button
            className="always-visible"
            icon
            onClick={e => handlePlayerAction(e, 'previous')}
            aria-label="Previous track"
          >
            <Icon name='backward' />
          </Button>

          {currentlyPlaying?.is_playing ? (
            <Button
              className="always-visible"
              icon
              onClick={e => handlePlayerAction(e, 'pause')}
              aria-label="Pause"
            >
              <Icon name='pause' />
            </Button>
          ) : (
            <Button
              className="always-visible"
              icon
              onClick={e => handlePlayerAction(e, 'play')}
              aria-label="Play"
            >
              <Icon name='play' />
            </Button>
)}

<Button
  className="always-visible"
  icon
  onClick={e => handlePlayerAction(e, 'next')}
  aria-label="Next track"
>
  <Icon name='forward' />
</Button>
            </div>
          ) : (
            <div className="spotify-controls-placeholder"><p></p></div>
          )}

        </Segment>
      )}
    </div>
  );
}
