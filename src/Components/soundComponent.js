import { useEffect, useState }  from 'react'
import { Divider, Container, Header, Button, Icon } from 'semantic-ui-react'
import { loadData, uid} from '../utils.js';


const Sound = () => {
  
  const [soundData, setSoundData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const count = 5;
  
  useEffect(() => {
    loadData(setSoundData, 'sound');
  }, [currentPage]);
  
  const totalPages = Math.ceil(soundData.length / count);
  
  const prevPage = () =>
    setCurrentPage((currentPage - 1 + totalPages) % totalPages);
  
  const nextPage = () =>
    setCurrentPage((currentPage + 1) % totalPages);
  
  
  return(
    <Container text>
    <br />
    {
      soundData.slice(currentPage * count, (currentPage + 1) * count).map(element =>
        <div key={uid()}>
        <Container text>
        <Header as='h3' className={element.className}>{element.title}</Header>
        {element.body.split('\n').map(x => <p className={element.className} key={uid()}>{x}</p>)}
        <iframe title={element.title} width="100%" height={element.playlist === true ? 350 : 150} allow="autoplay" src={element.soundCloudLink}></iframe>
        </Container>
        <Divider />
        </div>
      )
    }
    
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
  )
};

export default Sound;