import { getSpotifyTrackId } from '../utils/general.js';

// Renders a post's optional SoundCloud/Spotify embeds. Shared by the preview
// list (blogComponent) and the full single-post page (singlePostComponent)
// across blog/review/noises - reacts to soundCloudLink/spotifySongId whenever
// present, regardless of post type; renders nothing when they're null.
export default function PostEmbeds({ title, soundCloudLink, spotifySongId, playlist }) {
  const trackId = getSpotifyTrackId(spotifySongId);

  return (
    <>
      {soundCloudLink && (
        <iframe
          title={title}
          width="100%"
          height={playlist === true ? 350 : 150}
          allow="autoplay"
          src={soundCloudLink}
          frameBorder="0"
          className="single-post-iframe"
        />
      )}

      {trackId && (
        <iframe
          title={`Spotify: ${title}`}
          src={`https://open.spotify.com/embed/track/${trackId}`}
          width="100%"
          height="150"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
          style={{ borderRadius: '8px', marginTop: '1rem', marginBottom: '-5rem' }}
          className="single-post-spotify-embed"
        />
      )}
    </>
  );
}
