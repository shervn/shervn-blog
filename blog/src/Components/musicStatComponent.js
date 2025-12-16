import { useState, useEffect } from "react";
import { Grid, Container, Header, List, Loader, Image } from "semantic-ui-react";
import { getTopSongs, getTopArtists, getPlaylist } from "../utils/lambdaUtils.js";
import { MUSIC_STAT_LIMIT, MUSIC_STAT_TIME_RANGE } from "../utils/constants.js";

export default function MusicStatComponent() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [songsRes, artistsRes, playlistRes] = await Promise.all([
          getTopSongs(MUSIC_STAT_LIMIT, MUSIC_STAT_TIME_RANGE),
          getTopArtists(MUSIC_STAT_LIMIT),
          getPlaylist()
        ]);
        
        setSongs(songsRes);
        setArtists(artistsRes);
        if (playlistRes && !playlistRes.error) {
          setPlaylist(playlistRes);
        }
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
  if (!songs.length && !artists.length && !playlist) return null;

  return (
    <Container
      className="stats music-stat-container"
    >
      <Grid stackable columns={2} divided>
        {playlist && playlist.tracks && playlist.tracks.length > 0 && (
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <Header as="h4" textAlign="center" style={{ background: 'var(--color-bg-song)' }}>
                Recently Selected Songs
              </Header>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Grid stackable columns={2} className="playlist-grid">
                  {playlist.tracks.slice(0, 12).map((track, i) => {
                    const isLeftColumn = i % 2 === 0;
                    const textAlign = isLeftColumn ? 'right' : 'left';
                    const flexDirection = isLeftColumn ? 'row-reverse' : 'row';
                    
                    return (
                      <Grid.Column key={i} className="playlist-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection }}>
                          {track.albumArt && (
                            <Image 
                              src={track.albumArt} 
                              alt={track.albumName}
                              size="tiny"
                              style={{ width: '64px', height: '64px', objectFit: 'cover', flexShrink: 0 }}
                            />
                          )}
                          <div style={{ flex: 1, textAlign }}>
                            <a href={track.url} target="_blank" rel="noreferrer">
                              {track.song}
                            </a>
                            <div className="music-stat-artist">{track.artist}</div>
                            {track.albumName && (
                              <div style={{ fontSize: '0.9em', opacity: 0.7, marginTop: '0.25rem' }}>
                                {track.albumName}
                              </div>
                            )}
                          </div>
                        </div>
                      </Grid.Column>
                    );
                  })}
                </Grid>
              </div>
            </Grid.Column>
          </Grid.Row>
        )}
        
        <Grid.Row>
          <Grid.Column textAlign="right">
            <Header as="h4" style={{ background: 'var(--color-bg-band)' }}>
              Top Songs (last 4 weeks)
            </Header>
            <List relaxed>
              {songs.map((s, i) => (
                <List.Item key={i}>
                  <List.Content>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.song}
                    </a>
                    <div className="music-stat-artist">{s.artist}</div>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Grid.Column>

          <Grid.Column textAlign="left">
          <Header as="h4" style={{ background: 'var(--color-bg-band)' }}>
              Top Artists (last 4 weeks)
            </Header>
            <List relaxed>
              {artists.map((a, i) => (
                <List.Item key={i}>
                  <List.Content>
                    <a href={a.url} target="_blank" rel="noreferrer">
                      {a.band}
                    </a>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
