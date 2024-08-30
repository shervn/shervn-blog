import React, { useEffect, useState }  from 'react'
import { Container, Card, Button, Label } from 'semantic-ui-react'
import Review from './reviewComponent.js'
import { toFarsi, loadData } from '../utils.js';

const count = 6;

const Reviews = () => {

  const [reviewsData, setReviewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    loadData(setReviewsData, 'review');
  }, [currentPage]);

  const prevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, Math.ceil(reviewsData.length / count)));
  };
  return (
    <Container className="cardsContainer">
      <Card.Group centered id="cardsR2L">
        {
          reviewsData.slice((currentPage - 1) * count, currentPage * count).map(review => <Review review={review} className="farsiCard" key={review.order + review.date}/>)
        }
      </Card.Group>
      <br />
      <div className="buttons">
        <Button circular compact icon='chevron left' onClick={prevPage} />
        <Label basic>
          <h4 className="farsiPost">{toFarsi(currentPage)}</h4>
        </Label>
        <Button circular compact icon='chevron right' onClick={nextPage} />
      </div>
    </Container>)
};

export default Reviews;



