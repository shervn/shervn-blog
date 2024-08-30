import React from 'react'
import {
  Container, Header, Divider, Button, Image, Label, } from 'semantic-ui-react'
import { toFarsi, loadData, getImagePath } from '../utils.js';
import { useEffect, useState } from 'react';

const count = 8;

const Blog = () => {

  const [blogData, setBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    loadData(setBlogData, 'blog');
  }, [currentPage]);

  const prevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, Math.ceil(blogData.length / count)));
  };

  return (
    <Container text>

      <ul className="blogList">
        {
          blogData.slice((currentPage - 1) * count, currentPage * count).map(element =>
            <li key={element.order + element.date}>
              <br />

                  <Container text className={element.className}>
                    <Header as='h3' content={element.title} className={element.className} />
                    {element.image ? <Image className='notinvert' src={getImagePath(element.image)} floated='left' size='small' /> : ''}
                    {element.body.split('\n').map(x => <p className={element.className} key={(Math.random() + 1).toString(36).substring(4)}>{x}</p>)}
                    <Header as='h3' content={element.date} className='dateField' />
                 
                  </Container>
              <Divider />
            </li>
          )
        }
      </ul>

      <div className="buttons">
        <Button circular compact icon='chevron left' onClick={prevPage} />
        <Label basic>
          <h4 className="farsiPost">{toFarsi(currentPage)}</h4>
        </Label>
        <Button circular compact icon='chevron right' onClick={nextPage} />
      </div>
    </Container>
  )
};

export default Blog;