import React, { useEffect, useState } from 'react';
import { Container, Header, Image, Divider } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { getImagePath, renderBoldQuotes } from '../utils.js';

const SinglePost = ({ type, uuid }) => {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!type || !uuid) return;

    fetch(`/data/${type}.json`)
      .then((res) => res.json())
      .then((data) => {
        const foundPost = data.find((item) => item.uuid === uuid);
        if (foundPost) {
          setPost(foundPost);
        } else {
          navigate('/'); // go home if not found
        }
      })
      .catch((err) => {
        console.error('Failed to load post data:', err);
        navigate('/'); // redirect on fetch error
      });
  }, [type, uuid, navigate]);

  if (!post) return null;

  return (
    <Container text style={{ marginTop: '2rem' }} className={post.className}>
      {/* Title */}
      <Header as="h2" content={post.title} className={post.className} />

      {/* Image */}
      {post.image && (
        <Image
          src={getImagePath(post.image)}
          floated="left"
          size="medium"
          style={{ marginRight: '1rem', marginBottom: '1rem' }}
        />
      )}

      {/* Body */}
      {post.body.split('\n').map((line, idx) => (
        <p key={idx} className={post.className} style={{ lineHeight: '1.6rem' }}>
          {renderBoldQuotes(line)}
        </p>
      ))}

      {/* Date */}
      {post.date && (
        <Header as="h4" content={post.date} className="dateField" style={{ marginTop: '2rem' }} />
      )}

      {/* Sound iframe (if noises type) */}
      {type === 'noises' && post.soundCloudLink && (
        <iframe
          title={post.title}
          width="100%"
          height={post.playlist === true ? 350 : 150}
          allow="autoplay"
          src={post.soundCloudLink}
          frameBorder="0"
          style={{ marginTop: '1rem' }}
        />
      )}

      <Divider />
    </Container>
  );
};

export default SinglePost;
