import { useEffect, useState } from 'react';
import { Container, Header, Divider, Button, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { loadData, getImagePath, renderBoldQuotes  } from '../utils.js';

const Blog = ({ type = "blog" }) => {
  const [blogData, setBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  
  const count = type === "blog" ? 8 : 4;
  const maxPreviewLength = 500;
  
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
              <br />
              <Container text className={element.className}>
                <Header as="h3" content={element.title} className={element.className} />
                {element.image && <Image src={getImagePath(element.image)} floated="left" size="small" />}

                {lines.map((line, idx) => {
                  const renderedLine = renderBoldQuotes(line);
                  if (idx === lastLineIndex && shouldTruncate) {
                    return (
                      <p className={element.className} key={idx} style={{ display: 'inline' }}>
                        {renderedLine} 
                        <span style={{ display: 'inline-block', marginLeft: '0.3rem' }}>
                          ...{' '}
                          <Header
                            as={Link}
                            to={`/${type}/${element.uuid}`}
                            basic
                            size="tiny"
                            style={{ 
                              padding: '0', 
                              minWidth: 'auto', 
                              color: 'inherit', 
                              background: 'rgb(222, 239, 217)' 
                            }}
                          >
                            [ادامه]
                          </Header>
                        </span>
                      </p>
                    );
                  } else {
                    return <p className={element.className} key={idx}>{renderedLine}</p>;
                  }
                })}

                <Header as="h3" content={element.date} className="dateField" style={{ marginTop: '0.5rem' }} />
              </Container>
              <Divider />
            </li>
          );
        })}
      </ul>
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginTop: "2rem",
        }}
      >
        <Button icon onClick={prevPage}>
          <Icon name="angle left" />
        </Button>
        
        <div style={{ display: "flex", gap: "8px" }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "black",
                opacity: i === currentPage ? 1 : 0.3,
              }}
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
