import { useEffect, useState } from 'react';
import { Container, Header, Divider, Image, Icon } from 'semantic-ui-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PostMarkdown from './postMarkdown.js';
import PostEmbeds from './postEmbeds.js';
import { loadData, loadPostBody, getImagePath } from '../utils/general.js';
import { BLOG_POSTS_PER_PAGE, REVIEW_POSTS_PER_PAGE, BLOG_PREVIEW_MAX_LENGTH, SOUND_POSTS_PER_PAGE } from '../utils/constants.js';

const Blog = ({ type = "blog" }) => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Map type to route path (type is "review" but route is "reviews")
  const routePath = type === "review" ? "reviews" : type;
  
  const count = type === "blog" 
    ? BLOG_POSTS_PER_PAGE 
    : type === "review" 
    ? REVIEW_POSTS_PER_PAGE 
    : SOUND_POSTS_PER_PAGE;
  const maxPreviewLength = BLOG_PREVIEW_MAX_LENGTH;
  
  useEffect(() => {
    setIsLoading(true);
    loadData(async (data) => {
      const withBodies = await Promise.all(
        data.map(async (post) => ({ ...post, body: await loadPostBody(type, post.uuid) }))
      );
      setBlogData(withBodies);
      setIsLoading(false);
    }, type);
  }, [type]);
  
  const totalPages = Math.ceil(blogData.length / count);
  
  // Initialize page from URL, validate against totalPages
  // Page is required in URL, default to 1 if missing
  useEffect(() => {
    if (!isLoading && totalPages > 0) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const validPage = Math.max(1, Math.min(pageNum, totalPages));
      const pageIndex = validPage - 1; // Convert to 0-based index
      
      if (pageIndex !== currentPage) {
        setCurrentPage(pageIndex);
      }
      
      // Redirect if page number is invalid or missing (use replace for redirects)
      if (!page || pageNum < 1 || pageNum > totalPages) {
        navigate(`/${routePath}/page/${validPage}`, { replace: true });
      }
    }
  }, [page, totalPages, isLoading, type, navigate, currentPage, routePath]);
  
  // Navigate to page URL to trigger route transition
  // Always use page number in URL, even for page 1
  const goToPage = (pageNum) => {
    const normalizedPage = ((pageNum % totalPages) + totalPages) % totalPages;
    navigate(`/${routePath}/page/${normalizedPage + 1}`, { replace: false });
  };
  
  const prevPage = () => {
    const newPage = (currentPage - 1 + totalPages) % totalPages;
    goToPage(newPage);
  };
  
  const nextPage = () => {
    const newPage = (currentPage + 1) % totalPages;
    goToPage(newPage);
  };

  if (isLoading) {
    return <Container text style={{ minHeight: '200px' }}></Container>;
  }
  
  return (
    <Container text>
      <ul className="blogList">
        {blogData.slice(currentPage * count, (currentPage + 1) * count).map(element => {
          return (
            <li key={element.order + element.date}>

              <Container
                text
                className={`blog-preview-card ${element.className}`}
                onClick={(e) => {
                  if (window.getSelection().toString().length > 0) return;
                  if (e.target.closest('a, iframe')) return;
                  navigate(`/${type}/${element.uuid}`);
                }}
              >
                <Header as="h3" content={element.title} className={element.className} />
                {element.image && <Image src={getImagePath(element.image, 'Misc')} floated="left" size="small" className="blog-preview-image" />}

                <PostMarkdown
                  body={element.body}
                  className={element.className}
                  maxLength={maxPreviewLength}
                  continueTo={`/${type}/${element.uuid}`}
                />

                {/* SoundCloud / Spotify embeds (if present) */}
                <PostEmbeds
                  title={element.title}
                  soundCloudLink={element.soundCloudLink}
                  spotifySongId={element.spotifySongId}
                  playlist={element.playlist}
                />

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
        <button className="blog-pagination-button" onClick={prevPage} type="button" aria-label="Previous page">
          <Icon name="angle left" />
        </button>
        
        <div className="blog-pagination-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`blog-pagination-dot ${i === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  goToPage(i);
                }
              }}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
        
        <button className="blog-pagination-button" onClick={nextPage} type="button" aria-label="Next page">
          <Icon name="angle right" />
        </button>
      </div>
      
    </Container>
  );
};

export default Blog;
