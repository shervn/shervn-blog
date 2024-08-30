import React, { useEffect, useState } from 'react';
import { Divider, Container, Header, Button, Label } from 'semantic-ui-react';
import { toFarsi, loadData, uid } from '../utils.js';

const count = 5;

const Video = () => {
  const [videoData, setVideoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData(setVideoData, 'video');
  }, [currentPage]);

  const prevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, Math.ceil(videoData.length / count)));
  };

  return (
    <div>
      <br />
      {videoData.slice((currentPage - 1) * count, currentPage * count).map(element => (
        <Container text key={uid()}>
          <Header as='h3' className={element.className}>{element.title}</Header>
          {element.body.split('\n').map((x, index) => (
            <p className={element.className} key={uid()}>{x}</p>
          ))}
          <Header as='h3' subheader={'- ' + element.date} className={element.className} />
          <iframe
            className='notinvert'
            title={element.title}
            width="100%"
            height={400}
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={element.youtubeLink}
          ></iframe>
          <Divider />
        </Container>
      ))}

      <div className="buttons">
        <Button circular compact icon='chevron left' onClick={prevPage} />
        <Label as='a' basic>
          <h4 className="farsiPost">{toFarsi(currentPage)}</h4>
        </Label>
        <Button circular compact icon='chevron right' onClick={nextPage} />
      </div>
    </div>
  );
}

export default Video;
