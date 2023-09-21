import React, {Component} from 'react'
import { Divider, Container, Header, Button, Label } from 'semantic-ui-react'
import { toFarsi } from '../util.js';
import  HTTPService  from  '../httpService';
const  httpService  =  new  HTTPService();

export default class Music extends Component {

constructor(props){
  super(props);
  this.state  = {
      posts: [],
      currentPage: 1,
      nextPageURL:  ''
    };

  this.nextPage  =  this.nextPage.bind(this);
  this.prevPage  =  this.prevPage.bind(this);
};

componentDidMount() {
  httpService.getPosts('vid_posts').then(function (result) {
      console.log(result);
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

  const youtubes = this.state.posts;
  var t = youtubes.map(element =>
    <div>
      <Container text>
        <Header as='h3' className={element.className}>{element.title}</Header>
        {element.body.split('\n').map(x => <p className={element.className}>{x}</p>)}
        <Header as='h3' subheader={'- ' + element.date} className={element.className} />
        <iframe className='notinvert' title={element.title} width="100%" height={400} scrolling="no" frameborder="no" allow="autoplay" src={element.youtubeLink}></iframe>
      </Container>
      <Divider />
    </div>
  );
  
return(
  <Container text>
    <br />
    {/* <p className='nicep post'>Here are some of my music collages, a combination of playing multiple instruments, which are all based
    on improvisation.</p> */}
    {/* <Divider /> */}
    {t}
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