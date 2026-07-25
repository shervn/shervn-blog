import { useState, useEffect } from "react";
import { Grid, Container, Header, Loader, Image } from "semantic-ui-react";
import { getTopSongs, getTopArtists, getMyPlaylists, getRecentTracks } from "../utils/lambdaUtils.js";
import { MUSIC_STAT_LIMIT, MUSIC_STAT_TIME_RANGE } from "../utils/constants.js";

function SectionHeader({ children, band }) {
  return (
    <Header
      as="h4"
      textAlign="left"
      className="chip-header"
      style={{ background: band ? 'var(--color-bg-band)' : 'var(--color-bg-song)' }}
    >
      {children}
    </Header>
  );
}

function TrackGrid({ tracks }) {
  return (
    <div className="recent-tracks-container">
      {tracks.map((track, i) => (
        <div key={i} className="recent-track-item">
          {track.albumArt && <Image src={track.albumArt} alt={track.albumName} />}
          <div>
            <a href={track.url} target="_blank" rel="noreferrer">
              {track.song}
            </a>
            <div className="music-stat-artist">{track.artist || track.band}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArtistGrid({ artists }) {
  return (
    <div className="recent-tracks-container">
      {artists.map((artist, i) => (
        <div key={i} className="recent-track-item">
          {artist.image && <Image src={artist.image} alt={artist.band} circular />}
          <div>
            <a href={artist.url} target="_blank" rel="noreferrer">
              {artist.band}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

export default function MusicStatComponent() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [songsRes, artistsRes, playlistsRes, recentTracksRes] = await Promise.all([
          getTopSongs(MUSIC_STAT_LIMIT, MUSIC_STAT_TIME_RANGE),
          getTopArtists(MUSIC_STAT_LIMIT),
          getMyPlaylists(),
          getRecentTracks(10)
        ]);

        setSongs(songsRes);
        setArtists(artistsRes);
        setPlaylists(Array.isArray(playlistsRes) ? playlistsRes.filter((p) => p.tracks?.length > 0) : []);
        setRecentTracks(recentTracksRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="music-stat-loading" role="status" aria-live="polite">
        <Loader active indeterminate inline="centered" size="small" />
        <p>Loading music statistics...</p>
      </div>
    );
  if (!songs.length && !artists.length && !playlists.length && !recentTracks.length) return null;

  return (
    <Container className="stats music-stat-container">
      <Grid stackable columns={2} divided>
        {recentTracks.length > 0 && (
          <Grid.Row>
            <Grid.Column width={16} textAlign="left">
              <SectionHeader>Recently Played</SectionHeader>
              <TrackGrid tracks={recentTracks} />
            </Grid.Column>
          </Grid.Row>
        )}

        {playlists.map((playlist) => (
          <Grid.Row key={playlist.id}>
            <Grid.Column width={16} textAlign="left">
              <SectionHeader>{capitalize(playlist.name)}</SectionHeader>
              <TrackGrid tracks={playlist.tracks} />
            </Grid.Column>
          </Grid.Row>
        ))}

        <Grid.Row>
          <Grid.Column>
            <SectionHeader band>Top Songs (last 4 weeks)</SectionHeader>
            <TrackGrid tracks={songs} />
          </Grid.Column>

          <Grid.Column>
            <SectionHeader band>Top Artists (last 4 weeks)</SectionHeader>
            <ArtistGrid artists={artists} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
