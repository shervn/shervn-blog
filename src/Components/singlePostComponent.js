import React, { useEffect, useState } from 'react';
import { Container, Header, Image, Divider, Loader, Placeholder } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getImagePath, renderBoldQuotes, loadData } from '../utils/general.js';

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
        <Placeholder.Line length="three quarters" />
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

      {/* Sound iframe (if noises type) */}
      {type === 'noises' && post.soundCloudLink && (
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

      <Divider />
    </Container>
    </>
  );
};

export default SinglePost;
