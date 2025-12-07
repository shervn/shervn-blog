import { useEffect, useState } from 'react';
import { Container, Header, Divider, Button, Image, Icon } from 'semantic-ui-react';
import { loadData, getImagePath } from '../utils.js';


const Blog = ({ type }) => {
  const [blogData, setBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  
  const count = type === "blog" ? 8 : 4;
  
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
    {blogData.slice(currentPage * count, (currentPage + 1) * count).map(element => (
      <li key={element.order + element.date}>
      <br />
      <Container text className={element.className}>
      <Header as="h3" content={element.title} className={element.className} />
      {element.image && <Image src={getImagePath(element.image)} floated="left" size="small" />}
      {element.body.split('\n').map((x, idx) => (
        <p className={element.className} key={idx}>{x}</p>
      ))}
      <Header as="h3" content={element.date} className="dateField" />
      </Container>
      <Divider />
      </li>
    ))}
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
