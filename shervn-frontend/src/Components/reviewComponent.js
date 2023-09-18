import React, {Component} from 'react'
import { Dimmer, Card, Image, Icon, Header } from 'semantic-ui-react'

import ReviewDetail from './reviewDetailComponent'

import  HTTPService  from  '../httpService';
const  httpService  =  new  HTTPService();


export default class Review extends Component {

isMobile() {
  return window.innerWidth <= 768;
} 

constructor(props){
  super(props);
  this.state  = {
      active: false || this.isMobile(),
      activeModal: false,
      pageUrl:  this.props.review.pageUrl
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
      this.setState({ posts:  result.data, prevPageURL: this.state.nextPageURL, nextPageURL:  result.nextlink, currentPage: result.currentpage})
  });
}

prevPage(){
  httpService.getPostsByURL(this.state.nextPageURL).then((result) => {
      this.setState({ posts:  result.data, prevPageURL: result.prevlink, nextPageURL:  result.nextlink, currentPage: result.currentpage})
  });
}


handleShow = () => (this.setState({active: true || this.isMobile()}))
handleHide = () => (this.setState({active: false || this.isMobile()}))
changeActiveModal = () => (this.setState({activeModal: !this.setState.activeModal}))
closeModal = () => (this.setState({activeModal: false}))

render(){

let active = this.state.active;
let content = <Header size="big" className="farsiTitleWhite">{this.props.review.bandName}</Header>

return(
  <div className="farsiCard">
  <ReviewDetail activeModal={this.state.activeModal} review={this.props.review} handleClose={this.closeModal}/>
  <Card>
  <Image as={Dimmer.Dimmable}
  onClick={this.changeActiveModal}
  blurring={true}
  dimmed={this.state.active}
  dimmer={{active, content}}
  onMouseEnter={this.handleShow}
  onMouseLeave={this.handleHide}
  src={this.props.review.imageUrl} wrapped ui={false}
  className='notinvert'
  size='medium'/>
  <Card.Content className='farsiPost'>
    {this.props.review.title}
  </Card.Content>
  <Card.Content extra>
        <p className='farsiPost'>
        <Icon name='calendar alternate' />
        {' ' + this.props.review.date}
        </p>
  </Card.Content>
  </Card>
  </div>
  )
}
}