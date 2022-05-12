import React, {Component} from 'react'
import { Container, Card, Button, Label } from 'semantic-ui-react'
import Review from './reviewComponent'
import  HTTPService  from  '../httpService';
import { toFarsi } from '../util.js';

const  httpService  =  new  HTTPService();


export default class Reviews extends Component {

constructor(props){
  super(props);
  this.state  = {
      posts: [],
      nextPageURL:  '',
      currentPage: 1,
      prevPageURL: ''
    };

  this.nextPage  =  this.nextPage.bind(this);
  this.prevPage  =  this.prevPage.bind(this);
};


componentDidMount() {
  httpService.getPosts('rv_posts').then(function (result) {
      this.setState({ posts: result.data,
                      nextPageURL:  result.nextlink,
                      prevPageURL:  result.prevlink})
  }.bind(this));
}

nextPage(){
  httpService.getPostsByURL(this.state.nextPageURL).then((result) => {
      this.setState({ posts:  result.data, prevPageURL: this.state.nextPageURL, nextPageURL:  result.nextlink, currentPage: result.currentpage})
  });
}

prevPage(){
  httpService.getPostsByURL(this.state.nextPageURL).then((result) => {
      this.setState({ posts:  result.data, prevPageURL: result.prevlink, nextPageURL:  result.nextlink, currentPage: result.currentpage})
  });
}

render()
{
  const reviews = this.state.posts;
  var t = reviews.map(review => <Review review={review} className="farsiCard"/>);
return(
  <Container className="cardsContainer">
      <Card.Group centered id="cardsR2L">
      {t}
      </Card.Group>
      <br/>
      <div className="buttons">
          <Button circular compact icon='chevron left' onClick=  {  this.prevPage  } />
          <Label basic>
          <h4 className="farsiPost">{toFarsi(this.state.currentPage)}</h4>
          </Label>
          <Button circular compact icon='chevron right' onClick=  {  this.nextPage  }/>
      </div>
  </Container>)};

  }

