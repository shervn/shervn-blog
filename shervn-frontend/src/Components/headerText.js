import React, { Component } from 'react'
import { Header, Image, Modal, Icon, Button } from 'semantic-ui-react'


export default class HeaderText extends Component {
  state = { modalOpen: false }

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <div>
        <Modal
          trigger={<img alt='flower' onClick={this.handleOpen} src={require('../images/asterrisk.png')} className='rotate' />}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          basic
          size='small'>
          <Header icon='asterisk' color='white' content='F. Fozouni' />
          <Modal.Content>
            <Image src={require('../images/fozouni.jpg')} />
          </Modal.Content>
          <Modal.Actions>
            <Button color='red' onClick={this.handleClose} inverted>
              <Icon name='close' /> Close
            </Button>
          </Modal.Actions>
        </Modal>
        <Image floated='left' src={require('../images/profile2.jpeg')} id="profilepix" size='tiny' circular />
        <Header className='headerText'
          as='h2'
          content='Shervin Dehghani'
          subheader='Because the wind is high, it blows my mind.'
        />
      </div>
    )
  }
}
