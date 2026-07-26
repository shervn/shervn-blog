import React, { useEffect, useState } from 'react';
import { Container, Header, Image, Divider, Loader, Placeholder } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PostMarkdown from './postMarkdown.js';
import PostEmbeds from './postEmbeds.js';
import { getImagePath, loadData, loadPostBody } from '../utils/general.js';

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

    loadData(async (data) => {
      const foundPost = data.find((item) => item.uuid === uuid);
      if (foundPost) {
        const body = await loadPostBody(type, uuid);
        setPost({ ...foundPost, body });
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
        <meta property="og:type" content="article" />
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
      <Container className="single-post-container" role="article">
        <div className="single-post-layout">
          <div className="single-post-body-column">
            {/* Body */}
            <PostMarkdown body={post.body} className={`${post.className} single-post-paragraph`} />

            {/* SoundCloud / Spotify embeds (if present) */}
            <PostEmbeds
              title={post.title}
              soundCloudLink={post.soundCloudLink}
              spotifySongId={post.spotifySongId}
              playlist={post.playlist}
            />
          </div>

          <div className="single-post-meta-column">
            {/* Title */}
            <Header as="h2" content={post.title} className={post.className} />
            {/* Date */}
            {post.date && (
              <Header as="h4" content={post.date} className="dateField single-post-date" />
            )}
            {/* Image (desktop only) */}
            {post.image && (
              <Image
                src={getImagePath(post.image, 'Misc')}
                className="single-post-meta-image"
                alt={post.title || 'Post image'}
              />
            )}
          </div>
        </div>

        <Divider />
      </Container>
    </>
  );
};

export default SinglePost;
