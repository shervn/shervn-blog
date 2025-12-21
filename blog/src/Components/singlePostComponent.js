import React, { useEffect, useState } from 'react';
import { Container, Header, Image, Divider, Loader, Placeholder, Segment } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getImagePath, renderBoldQuotes, loadData } from '../utils/general.js';
import { getSong } from '../utils/lambdaUtils.js';

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
  const [song, setSong] = useState(null);
  const [songLoading, setSongLoading] = useState(false);
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

  useEffect(() => {
    if (post && post.songId) {
      setSongLoading(true);
      getSong(post.songId)
        .then((songData) => {
          if (songData && !songData.error) {
            setSong(songData);
          }
        })
        .catch((err) => {
          console.error('Error loading song:', err);
        })
        .finally(() => {
          setSongLoading(false);
        });
    }
  }, [post]);

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
          height={post.playlist === true ? 350 : 150}
          allow="autoplay"
          src={post.soundCloudLink}
          frameBorder="0"
          className="single-post-iframe"
        />
      )}

      {/* Song display (if songId is present) */}
      {post.songId && (
        <Segment basic style={{ paddingRight:0 }}>
          {songLoading ? (
            <Loader active inline="right" size="small" />
          ) : song ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem',flexWrap: 'wrap' }}>
              {song.albumArt && (
                <Image 
                  src={song.albumArt} 
                  alt={song.album}
                  size="small"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', flexShrink: 0, borderRadius: '4px' }}
                />
              )}
              <div style={{ minWidth: '200px' }}>
                <Header as="h4" style={{ marginBottom: '0.5rem' }}>
                  <a href={song.url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                    {song.song}
                  </a>
                </Header>
                <p style={{ margin: '0.25rem 0', opacity: 0.8 }}>
                  {song.artist}
                </p>
                {song.album && (
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9em', opacity: 0.7 }}>
                    {song.album}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p style={{ opacity: 0.6 }}>Unable to load song information</p>
          )}
        </Segment>
      )}

      <Divider />
    </Container>
    </>
  );
};

export default SinglePost;
