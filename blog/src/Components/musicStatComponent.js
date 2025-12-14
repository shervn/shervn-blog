import { useState, useEffect } from "react";
import { Grid, Container, Header, List, Loader } from "semantic-ui-react";
import { getTopSongs, getTopArtists } from "../utils/lambdaUtils.js";
import { MUSIC_STAT_LIMIT, MUSIC_STAT_TIME_RANGE } from "../utils/constants.js";

export default function MusicStatComponent() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [songsRes, artistsRes] = await Promise.all([
          getTopSongs(MUSIC_STAT_LIMIT, MUSIC_STAT_TIME_RANGE),
          getTopArtists(MUSIC_STAT_LIMIT)
        ]);
        setSongs(songsRes);
        setArtists(artistsRes);
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
  if (!songs.length && !artists.length) return null;

  return (
    <Container
      className="stats music-stat-container"
    >
      <Grid stackable columns={2} divided>
        <Grid.Row>
          <Grid.Column textAlign="right">
            <Header as="h4">
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
          <Header as="h4">
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
