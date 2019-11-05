import React, {Component} from 'react'
import { Divider, Container, Header, Button } from 'semantic-ui-react'

import  HTTPService  from  '../httpService';
const  httpService  =  new  HTTPService();


export default class Music extends Component {

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
  httpService.getPosts('sc_posts').then(function (result) {
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

render(){

  const soundclouds = this.state.posts;
  var t = soundclouds.map(element =>
    <div>
      <Container text>
        <Header as='h3' className={element.className}>{element.title}</Header>
        {element.body.split('\n').map(x => <p className={element.className}>{x}</p>)}
        <iframe width="100%" height={element.playlist === true ? 350 : 150} scrolling="no" frameborder="no" allow="autoplay" src={element.soundCloudLink}></iframe>
      </Container>
      <Divider />
    </div>
  );
  
return(
  <Container text>
    <br />
    <p className='nicep post'>Music, and playing music is my [main] hobby. I play different music instruments and always like to try new ones. Piano and Setar (an Iranian music Instrument) are the ones I play for a longer time, but lately I've been practicing Trumpet too.</p>
    <p>I record time to time the stuff I play or the sounds I hear. Based on the recordings, I'm gathering two collections which are:</p>
    <ul>
      <li><p>Improvisation for Home: a collection of my improvisations.</p></li>
      <li><p>Through the Cities: a collection of street music of different cities that I have visited.</p></li>
    </ul>
    <p>They probably lack many quality standards but I still like to continue recording, at least for a while.</p>
    <Divider />
    {t}
    <div className="buttons">
          <Button icon='chevron left' onClick=  {  this.prevPage  } />
          <Button icon='chevron right' onClick=  {  this.nextPage  }/>
        </div>
  </Container>
  )
}
}