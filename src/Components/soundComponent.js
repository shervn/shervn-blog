import React, { useEffect, useState }  from 'react'
import { Divider, Container, Header, Button, Label } from 'semantic-ui-react'
import { toFarsi, loadData, uid} from '../utils.js';

const count = 5;

const Sound = () => {

  const [soundData, setSoundData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    loadData(setSoundData, 'sound');
  }, [currentPage]);

  const prevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, Math.ceil(soundData.length / count)));
  };

    return(
      <Container text>
        <br />

        {
          soundData.slice((currentPage - 1) * count, currentPage * count).map(element =>
            <div key={uid()}>
              <Container text>
                <Header as='h3' className={element.className}>{element.title}</Header>
                {element.body.split('\n').map(x => <p className={element.className} key={uid()}>{x}</p>)}
                <iframe title={element.title} width="100%" height={element.playlist === true ? 350 : 150} scrolling="no" frameBorder="no" allow="autoplay" src={element.soundCloudLink}></iframe>
              </Container>
              <Divider />
            </div>
          )
        }
    
        <div className="buttons">
        <Button circular compact icon='chevron left' onClick=  {  prevPage  } />
              <Label basic>
              <h4 className="farsiPost">{toFarsi(currentPage)}</h4>
              </Label>
              <Button circular compact icon='chevron right' onClick=  {  nextPage  }/>
        </div>
      </Container>
      )
};

export default Sound;