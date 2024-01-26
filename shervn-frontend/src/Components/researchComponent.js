import React, { Component } from 'react'
import { Container, Header, Divider, Button, Label } from 'semantic-ui-react'
import { toEnglish } from '../util.js';
import  HTTPService  from  '../httpService.js';

const  httpService  =  new  HTTPService();

export default class Research extends Component {

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
            <div dangerouslySetInnerHTML={{__html: element.description}}></div>
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
          I'm a research assistant in <em>Klinikum rechts der Isar der Technischen Universität München</em>. I'm pursuing my PhD on Image Guided Micro Robotics. You can find more details <a href="https://www.cs.cit.tum.de/en/camp/members/shervin-dehghani/">here</a>.
    </p>
      <p className="post">
          
      </p>
        <br />
        <ul className='researchList'>
          {t}
        </ul>

        <div className="buttons">
        <Button circular compact icon='chevron left' onClick=  {  this.prevPage  } />
        <Label basic>
        <h4 className="">{toEnglish(this.state.currentPage)}</h4></Label>
        <Button circular compact icon='chevron right' onClick=  {  this.nextPage  }/>
        </div>

      </Container>
    )
  }
}