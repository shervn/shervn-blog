import React, {Component} from 'react'
import { Container, Card, Button, Divider } from 'semantic-ui-react'

import Review from './reviewComponent'

import  HTTPService  from  '../httpService';
const  httpService  =  new  HTTPService();


export default class Reviews extends Component {

constructor(props){
  super(props);
  this.state  = {
      posts: [],
      nextPageURL:  '',
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
      this.setState({ posts:  result.data, prevPageURL: this.state.nextPageURL, nextPageURL:  result.nextlink})
  });
}

prevPage(){
  httpService.getPostsByURL(this.state.nextPageURL).then((result) => {
      this.setState({ posts:  result.data, prevPageURL: result.prevlink, nextPageURL:  result.nextlink})
  });
}

render()
{
  const reviews = this.state.posts;
  var t = reviews.map(review => <Review review={review} className="farsiCard"/>);
return(
  <Container className="cardsContainer">
      <Card.Group itemsPerRow={3}>
      {t}
      </Card.Group>
      <Divider />
      <div className="buttons">
          <Button icon='chevron left' onClick=  {  this.prevPage  } />
          <Button icon='chevron right' onClick=  {  this.nextPage  }/>
      </div>

  </Container>)};

  }

