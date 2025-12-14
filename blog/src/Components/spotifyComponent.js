import { useEffect, useState, useRef, useMemo } from 'react';
import { Icon, Segment, Grid, Loader } from 'semantic-ui-react';
import { timeAgo } from '../utils/general.js';
import waveGif from '../assets/wave.gif';
import {
  getToggleState,
  getRecentTracks,
  getCurrentlyPlaying,
  controlPlayer
} from '../utils/lambdaUtils.js';
import {
  SPOTIFY_REFRESH_INTERVAL,
  SPOTIFY_PROGRESS_UPDATE_INTERVAL,
  SPOTIFY_NEW_TRACK_CHECK_DELAY
} from '../utils/constants.js';

export function MusicPlayer() {
  const [spotifyTrack, setSpotifyTrack] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const intervalRef = useRef(null);
  const refreshRef = useRef(null);
  const prevButtonRef = useRef(null);
  const playPauseButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const isInitialLoad = useRef(true);
  const gifRef = useRef(null);
  const superGifRef = useRef(null);

  const fetchData = async () => {
    try {
      const toggleRes = await getToggleState();
      setShowButtons(toggleRes.state);
      const [spotifyRes, currentRes] = await Promise.all([
        getRecentTracks(1),
        getCurrentlyPlaying(),
      ]);

      setSpotifyTrack(spotifyRes[0] || null);
      
      // On initial load, if music is paused, don't allow play (user didn't pause it)
      if (isInitialLoad.current && currentRes) {
        setUserPaused(false); // Originally paused or playing, user didn't pause it
        isInitialLoad.current = false;
      } else if (currentRes && currentRes.is_playing) {
        // If music starts playing automatically (e.g., new track), reset userPaused
        // But only if it wasn't already false (to avoid resetting after user clicks play)
        setUserPaused(prev => prev && false);
      }
      
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
          }, SPOTIFY_NEW_TRACK_CHECK_DELAY);
        }
        return next;
      });
    }, SPOTIFY_PROGRESS_UPDATE_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [currentlyPlaying]);

  // Initialize and control GIF with libgif.js
  useEffect(() => {
    if (!gifRef.current || !window.SuperGif) return;

    // Initialize SuperGif if not already initialized
    if (!superGifRef.current) {
      superGifRef.current = new window.SuperGif({ 
        gif: gifRef.current,
        auto_play: false,
        draw_while_loading: false,
        show_progress_bar: false,
        max_width: 200,

      });
      superGifRef.current.load(() => {
        // GIF loaded, control based on playing state
        if (currentlyPlaying?.is_playing) {
          superGifRef.current.play();
        } else {
          superGifRef.current.pause();
        }
      });
    } else {
      // Control play/pause based on state
      if (currentlyPlaying?.is_playing) {
        superGifRef.current.play();
      } else {
        superGifRef.current.pause();
      }
    }

    return () => {
      // Cleanup if needed
      if (superGifRef.current) {
        superGifRef.current.pause();
      }
    };
  }, [currentlyPlaying?.is_playing]);

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
      
      // Track if user manually paused or played
      if (action === 'pause') {
        setUserPaused(true);
      } else if (action === 'play') {
        setUserPaused(false);
      } else if (action === 'previous' || action === 'next') {
        // When navigating to prev/next track, disable play (new track wasn't paused by user)
        setUserPaused(false);
      }
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
      {currentlyPlaying && (
        <div className="spotify-wave-gif-container">
          <img 
            ref={gifRef}
            src={waveGif} 
            alt="" 
            className="spotify-wave-gif"
            rel="animated_src"
          />
        </div>
      )}
      <p 
        className="spotify-listened-at"
        data-playing={currentlyPlaying?.is_playing ? 'true' : 'false'}
      >
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
          <button
            ref={prevButtonRef}
            className="always-visible"
            onClick={e => handlePlayerAction(e, 'previous')}
            aria-label="Previous track"
            type="button"
            disabled={!currentlyPlaying?.is_playing && !userPaused}
            style={!currentlyPlaying?.is_playing && !userPaused ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <Icon name='backward' />
          </button>

          {currentlyPlaying?.is_playing ? (
            <button
              ref={playPauseButtonRef}
              className="always-visible"
              onClick={e => handlePlayerAction(e, 'pause')}
              aria-label="Pause"
              type="button"
            >
              <Icon name='pause' />
            </button>
          ) : userPaused ? (
            <button
              ref={playPauseButtonRef}
              className="always-visible"
              onClick={e => handlePlayerAction(e, 'play')}
              aria-label="Play"
              type="button"
            >
              <Icon name='play' />
            </button>
          ) : (
            <button
              ref={playPauseButtonRef}
              className="always-visible"
              disabled
              aria-label="Play (disabled - music was originally paused)"
              type="button"
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <Icon name='play' />
            </button>
          )}

<button
  ref={nextButtonRef}
  className="always-visible"
  onClick={e => handlePlayerAction(e, 'next')}
  aria-label="Next track"
  type="button"
  disabled={!currentlyPlaying?.is_playing && !userPaused}
  style={!currentlyPlaying?.is_playing && !userPaused ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
>
  <Icon name='forward' />
</button>
            </div>
          ) : (
            <div className="spotify-controls-placeholder"><p></p></div>
          )}

        </Segment>
      )}
    </div>
  );
}
