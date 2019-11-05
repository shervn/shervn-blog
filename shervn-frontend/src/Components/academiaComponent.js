import React, { Component } from 'react'
import { Container, Header, Divider, Button } from 'semantic-ui-react'

import  HTTPService  from  '../httpService';
const  httpService  =  new  HTTPService();

export default class Academia extends Component {

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
    httpService.getPosts('ac_posts').then(function (result) {
        this.setState({ posts: result.data,
                        nextPageURL:  result.nextlink,
                        prevPageURL:  result.prevlink})
              }.bind(this));
              }

  nextPage(){
    httpService.getPostsByURL(this.state.nextPageURL).then((result) => {
      this.setState({ posts:  result.data, prevPageURL: result.prevlink, nextPageURL:  result.nextlink})
    });
  }

  prevPage(){
    httpService.getPostsByURL(this.state.prevPageURL).then((result) => {
      this.setState({ posts:  result.data, prevPageURL: result.prevlink, nextPageURL:  result.nextlink})
    });
  }

  render() {

    const t = this.state.posts.map(element =>
      <li key={element.title}>
        <Container>
          <Header as='h3'>{element.title}</Header>
          <Header as='h6'>{element.organization + ' ' + element.date}</Header>
          <p className="post">
            {element.description}
          </p>
        </Container>
        <br />
        <Divider />
      </li>
    );
    return (
      <Container text>
        <br />
        <p className='nicep post'>
          I'm currently studying my Masters in Informatics and will start writing my thesis soon. You can find my CV <a className="cv" href="https://www.dropbox.com/s/n93tdnvyw2ban9u/CV.pdf?dl=0">here</a>.
    </p>
        <p className="post">
          Here is a list of some of the projects that I've been working on:
      </p>
        <br />
        <ul>
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