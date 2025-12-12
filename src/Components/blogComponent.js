import { useEffect, useState } from 'react';
import { Container, Header, Divider, Button, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { loadData, getImagePath, renderBoldQuotes  } from '../utils/general.js';
import { BLOG_POSTS_PER_PAGE, REVIEW_POSTS_PER_PAGE, BLOG_PREVIEW_MAX_LENGTH, SOUND_POSTS_PER_PAGE } from '../utils/constants.js';

const Blog = ({ type = "blog" }) => {
  const [blogData, setBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  
  const count = type === "blog" 
    ? BLOG_POSTS_PER_PAGE 
    : type === "review" 
    ? REVIEW_POSTS_PER_PAGE 
    : SOUND_POSTS_PER_PAGE;
  const maxPreviewLength = BLOG_PREVIEW_MAX_LENGTH;
  
  useEffect(() => {
    setCurrentPage(0);
    loadData(setBlogData, type);
  }, [type]);
  
  const totalPages = Math.ceil(blogData.length / count);
  
  const prevPage = () =>
    setCurrentPage((currentPage - 1 + totalPages) % totalPages);
  
  const nextPage = () =>
    setCurrentPage((currentPage + 1) % totalPages);

  
  return (
    <Container text>
      <ul className="blogList">
        {blogData.slice(currentPage * count, (currentPage + 1) * count).map(element => {
          const shouldTruncate = element.body.length > maxPreviewLength;
          let previewText = element.body;
          if (shouldTruncate) {
            previewText = element.body.slice(0, maxPreviewLength);
          }

          const lines = previewText.split('\n');
          const lastLineIndex = lines.length - 1;

          return (
            <li key={element.order + element.date}>
             
              <Container text className={element.className}>
                <Header as="h3" content={element.title} className={element.className} />
                {element.image && <Image src={getImagePath(element.image, 'Misc')} floated="left" size="small" />}

                {lines.map((line, idx) => {
                  const renderedLine = renderBoldQuotes(line);
                  if (idx === lastLineIndex && shouldTruncate) {
                    return (
                      <p className={`${element.className} blog-preview-inline`} key={idx}>
                        {renderedLine} 
                        <span className="blog-preview-ellipsis">
                          ...{' '}
                          <Header
                            as={Link}
                            to={`/${type}/${element.uuid}`}
                            basic
                            size="tiny"
                            className="blog-preview-link"
                          >
                            {'/ادامه/'}
                          </Header>
                        </span>
                      </p>
                    );
                  } else {
                    return <p className={element.className} key={idx}>{renderedLine}</p>;
                  }
                })}

                {/* Sound iframe (if noises type) */}
                {type === 'noises' && element.soundCloudLink && (
                  <iframe
                    title={element.title}
                    width="100%"
                    height={element.playlist === true ? 350 : 150}
                    allow="autoplay"
                    src={element.soundCloudLink}
                    frameBorder="0"
                    className="single-post-iframe"
                  />
                )}

                <Header 
                  as={Link}
                  to={`/${type}/${element.uuid}`}
                  content={element.date} 
                  className="dateField blog-date" 
                />
              </Container>
              <Divider />
            </li>
          );
        })}
      </ul>
      
      <div className="blog-pagination">
        <Button icon onClick={prevPage}>
          <Icon name="angle left" />
        </Button>
        
        <div className="blog-pagination-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`blog-pagination-dot ${i === currentPage ? 'active' : ''}`}
            />
          ))}
        </div>
        
        <Button icon onClick={nextPage}>
          <Icon name="angle right" />
        </Button>
      </div>
      
    </Container>
  );
};

export default Blog;
