import React, { Component } from 'react'
import { Container, Header, Divider, Button } from 'semantic-ui-react'

import  HTTPService  from  '../httpService';
const  httpService  =  new  HTTPService();

export default class Blog extends Component {

  constructor(props){
    super(props);

    this.state  = {
      posts: [],
      nextPageURL:  ''
  };
  
    this.nextPage  =  this.nextPage.bind(this);
    this.prevPage  =  this.prevPage.bind(this);
  };
  
  componentDidMount() {
    httpService.getPosts('txt_posts').then(function (result) {
        this.setState({ posts: result.data,
                        nextPageURL:  result.nextlink,
                        prevPageURL:  result.prevlink,
                        currentPage: result.currentPage})
    }.bind(this));
  }

  nextPage(){
    httpService.getPostsByURL(this.state.nextPageURL).then((result) => 
        this.setState({ posts:  result.data, prevPageURL: result.prevlink, nextPageURL:  result.nextlink})
    );
  }
  
  prevPage(){
      httpService.getPostsByURL(this.state.prevPageURL).then((result) => 
        this.setState({ posts:  result.data, prevPageURL: result.prevlink, nextPageURL:  result.nextlink})
    );
  }

  render() {
    const t = this.state.posts.map(element =>
      <li key={element.pk}>
        <br />
        <Container text className={element.className}>
          <Header as='h3' content={element.title} className={element.className} />
          {element.body.split('\n').map(x => <p className={element.className}>{x}</p>)}
          <Header as='h3' subheader={'- ' + element.date} className={element.className} />
          <Divider />
        </Container>
      </li>
    );

    return (
      <Container text>
        <ul className="blogList">
          {t}
        </ul>
        <div className="buttons">
          <Button icon='chevron left' onClick=  {  this.prevPage  } />
          <Button icon='chevron right' onClick=  {  this.nextPage  }/>
        </div>
      </Container>
    )
  }
}
