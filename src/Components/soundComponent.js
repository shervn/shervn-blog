import { useEffect, useState } from 'react';
import { Divider, Container, Header, Button, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { loadData, renderBoldQuotes } from '../utils.js';

const Sound = () => {
  const [soundData, setSoundData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const count = 5;

  useEffect(() => {
    loadData(setSoundData, 'noises');
  }, []);

  const totalPages = Math.ceil(soundData.length / count);

  const prevPage = () =>
    setCurrentPage((currentPage - 1 + totalPages) % totalPages);

  const nextPage = () =>
    setCurrentPage((currentPage + 1) % totalPages);

  const goToNoise = (uuid) => {
    navigate(`/noises/${uuid}`);
  };

  return (
    <Container text>
      <br />
      {soundData
        .slice(currentPage * count, (currentPage + 1) * count)
        .map((element) => (
          <div
            key={element.uuid || element.title}
            onClick={() => goToNoise(element.uuid)}
            style={{ cursor: 'pointer' }}
          >
            <Container text>
              <Header as="h3" className={element.className}>
                {element.title}
              </Header>
              {element.body.split('\n').map((line, idx) => (
                <p className={element.className} key={idx}>
                  {renderBoldQuotes(line)}
                </p>
              ))}
              <iframe
                title={element.title}
                width="100%"
                height={element.playlist === true ? 350 : 150}
                allow="autoplay"
                frameBorder="0"
                src={element.soundCloudLink}
              />
            </Container>
            <Divider />
          </div>
        ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginTop: '2rem',
        }}
      >
        <Button icon onClick={prevPage}>
          <Icon name="angle left" />
        </Button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'black',
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

export default Sound;
