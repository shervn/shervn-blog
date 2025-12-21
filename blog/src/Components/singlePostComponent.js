import React, { useEffect, useState } from 'react';
import { Container, Header, Image, Divider, Loader, Placeholder } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getImagePath, renderBoldQuotes, loadData } from '../utils/general.js';

// Extract Spotify track ID from URL or use directly
const getSpotifyTrackId = (songId) => {
  if (!songId) return null;
  
  // If it's a full URL, extract the track ID
  const urlMatch = songId.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  return songId;
};

// Skeleton loader component
const PostSkeleton = () => (
  <Container text>
    <Placeholder>
      <Placeholder.Header>
        <Placeholder.Line length="very long" />
        <Placeholder.Line length="medium" />
      </Placeholder.Header>
      <Placeholder.Paragraph>
        <Placeholder.Line length="full" />
        <Placeholder.Line length="full" />
        <Placeholder.Line length="full" />
        <Placeholder.Line length="medium" />
      </Placeholder.Paragraph>
    </Placeholder>
    <Loader active inline="centered" />
  </Container>
);

const SinglePost = ({ type, uuid }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!type || !uuid) return;

    loadData((data) => {
      const foundPost = data.find((item) => item.uuid === uuid);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/');
      }
      setLoading(false);
    }, type);
  }, [type, uuid, navigate]);

  if (loading) return <PostSkeleton />;
  if (!post) return null;

  return (
    <>
      <Helmet>
        <title>{post.title} | shervn</title>
        <meta name="description" content={post.body?.substring(0, 160) || `Read ${post.title} on shervn's blog`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.body?.substring(0, 160) || ''} />
        {post.image && <meta property="og:image" content={getImagePath(post.image, 'Misc')} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": "Shervin Dehghani"
            }
          })}
        </script>
      </Helmet>
      <Container text className={`single-post-container ${post.className}`} role="article">
        {/* Title */}
        <Header as="h2" content={post.title} className={post.className} />
      {/* Date */}
      {post.date && (
        <Header as="h4" content={post.date} className="dateField single-post-date" />
      )}
      {/* Image */}
      {post.image && (
        <Image
          src={getImagePath(post.image, 'Misc')}
          floated="left"
          size="medium"
          className="single-post-image"
          alt={post.title || 'Post image'}
        />
      )}

      {/* Body */}
      {post.body.split('\n').map((line, idx) => (
        <p key={idx} className={`${post.className} single-post-paragraph`}>
          {renderBoldQuotes(line)}
        </p>
      ))}

      {/* Sound iframe (if soundCloudLink is present) */}
      {post.soundCloudLink && (
        <iframe
          title={post.title}
          width="100%"
          height="150"
          allow="autoplay"
          src={post.soundCloudLink}
          frameBorder="0"
          className="single-post-iframe"
        />
      )}

      {/* Spotify embed (if songId is present) */}
      {(() => {
        const trackId = post.songId ? getSpotifyTrackId(post.songId) : null;
        return trackId ? (
          <iframe
            title={`Spotify: ${post.title}`}
            src={`https://open.spotify.com/embed/track/${trackId}`}
            width="100%"
            height="150"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
            style={{ borderRadius: '8px', marginTop: '1rem', marginBottom: '-5rem' }}
            className="single-post-spotify-embed"
          />
        ) : null;
      })()}

      <Divider />
    </Container>
    </>
  );
};

export default SinglePost;
