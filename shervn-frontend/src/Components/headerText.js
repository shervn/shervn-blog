import React, { Component } from 'react'
import { Header, Image, Modal, Icon, Button } from 'semantic-ui-react'
import  HTTPService  from  '../httpService';

const  httpService  =  new  HTTPService();

export default class HeaderText extends Component {

  constructor(props){
    super(props);
    this.state  = {
      motto: '',
      prefix: '',
      music: '',
      artist: '',
      link: '',
    };
  };

  componentDidMount() {
    httpService.getDetails().then(function (result) {
      this.setState({ prefix: result[0],
                      music: result[1],
                      artist:  result[2],
                      link: result[3],
                      motto: result[4]})
}.bind(this));
}

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })


  render() {
 
    return (
      <div>
        <h5 className='musiclistening'>{this.state.prefix}<a href={this.state.link}>{this.state.music}</a> by {this.state.artist}</h5>

        <Modal
          trigger={<img alt='flower' onClick={this.handleOpen} src={require('../images/asterrisk.png')} className='rotate' />}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          size='small'>
          <Header icon='asterisk' content='F. Fozouni' />
          <Modal.Content>
            <Image className='notinvert' src={require('../images/fozouni.jpg')} />
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={this.handleClose} inverted>
              <Icon name='close' /> Close
            </Button>
          </Modal.Actions>
        </Modal>
        <Image className='notinvert' floated='left' src='https://shervn.com/media/blog_profile.png' id="profilepix" size='tiny' circular />
        <Header className='headerText'
          as='h2'
          content='Shervin Dehghani'
          subheader={this.state.motto}
        />
      </div>
    )
  }
}
