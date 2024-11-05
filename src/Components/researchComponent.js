import React from 'react'
import { Divider, Container, Header, Button, Label } from 'semantic-ui-react'
import { toEnglish, loadData} from '../utils.js';
import { useEffect, useState } from 'react';

const count = 5;

const Research = () => {

  const [researchData, setResearchData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    loadData(setResearchData, 'research');
  }, [currentPage]);

  const prevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, Math.ceil(researchData.length / count)));
  };

  return (
    <Container text>
      <br />
      <p className='nicep post'>
        I'm a research assistant in <em>Klinikum rechts der Isar der Technischen Universität München</em>. I'm pursuing my PhD on Image Guided Micro Robotics. You can find more details <a className="textRef" href="https://www.cs.cit.tum.de/en/camp/members/shervin-dehghani/">here</a>.
      </p>
      <Divider />
      <p>Here is a list of the research projects in which I have been involved:</p>
      <ul className='researchList'>
        {
          researchData.slice((currentPage - 1) * count, currentPage * count).map(element =>
            <li key={element.title}>
              <Container>
                <Header as='h3'>{element.title}</Header>
                <Header as='h6'>{element.organization + ' / ' + element.date}</Header>
                <p className="post">
                  <div dangerouslySetInnerHTML={{__html: element.description}}></div>
                </p>
                {element.projectLink.length ? <Header as='h6'><a href={element.projectLink} target='_blank'>[Project Page]</a></Header> : ""} 
              </Container>
              <br />
              <Divider />
            </li>
          )
        }
      </ul>
      <div className="buttons">
      <Button circular compact icon='chevron left' onClick=  {  prevPage  } />
      <Label basic>
      <h4 className="">{toEnglish(currentPage)}</h4></Label>
      <Button circular compact icon='chevron right' onClick=  {  nextPage  }/>
      </div>
    </Container>
  )
  
};

export default Research;


