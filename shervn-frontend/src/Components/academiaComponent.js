import React, { Component } from 'react'
import { Container, Header, Divider, Button, Label } from 'semantic-ui-react'
import { toFarsi } from '../util.js';
import  HTTPService  from  '../httpService';

const  httpService  =  new  HTTPService();

export default class Academia extends Component {

  constructor(props){
    super(props);
    this.state  = {
        posts: [],
        nextPageURL:  '',
        currentPage: 1
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
        this.setState({ posts:  result.data, prevPageURL: this.state.nextPageURL, nextPageURL:  result.nextlink, currentPage: result.currentpage})
    });
  }
  
  prevPage(){
    httpService.getPostsByURL(this.state.nextPageURL).then((result) => {
        this.setState({ posts:  result.data, prevPageURL: result.prevlink, nextPageURL:  result.nextlink, currentPage: result.currentpage})
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
          {element.projectLink.length ? <Header as='h6'><a href={element.projectLink}>{element.projectLink}</a></Header> : ""} 
        </Container>
        <br />
        <Divider />
      </li>
    );
    return (
      <Container text>
        <br />
        <p className='nicep post'>
          I'm a research assistant in Klinikum rechts der Isar der Technischen Universität München. I'm pursuing my PhD on Image Guided Micro Robotics.
    </p>
        <p className="post">
          Here is a list of the most recent projects that I have been working on:
      </p>
        <br />
        <ul>
          {t}
        </ul>

        <div className="buttons">
        <Button icon='chevron left' onClick=  {  this.prevPage  } />
        <Label as='a' basic>
        <h4 className="farsiPost">{toFarsi(this.state.currentPage)}</h4></Label>
        <Button icon='chevron right' onClick=  {  this.nextPage  }/>
        </div>

      </Container>
    )
  }
}
