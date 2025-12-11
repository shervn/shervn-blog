import { useState, useEffect } from "react";
import { Grid, Container, Header, List, Loader } from "semantic-ui-react";

export default function MusicStatComponent() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  const SONGS_API =
    "https://11bv2r6dq0.execute-api.us-east-1.amazonaws.com/top-songs?limit=5&time_range=short_term";
  const ARTISTS_API =
    "https://11bv2r6dq0.execute-api.us-east-1.amazonaws.com/top-artists?limit=5";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [songsRes, artistsRes] = await Promise.all([
          fetch(SONGS_API).then(r => r.json()),
          fetch(ARTISTS_API).then(r => r.json())
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
      <div style={{ textAlign: 'center' }}>
        <Loader active indeterminate inline="centered" size="small" />
        <p>Loading...</p>
      </div>
    );
  if (!songs.length && !artists.length) return null;

  return (
    <Container
      style={{ width: "50%", margin: "2rem auto", fontFamily: "farsi" }}
      className="stats"
    >
      <Grid stackable columns={2} divided>
        <Grid.Row>
          <Grid.Column textAlign="right">
            <Header dividing as="h4" content="Top Song" subheader="last 4 weeks"/>
            <List relaxed>
              {songs.map((s, i) => (
                <List.Item key={i}>
                  <List.Content>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.song}
                    </a>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>{s.artist}</div>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Grid.Column>

          <Grid.Column textAlign="left">
            <Header dividing as="h4" content="Top Artists" subheader="last 4 weeks"/>

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
