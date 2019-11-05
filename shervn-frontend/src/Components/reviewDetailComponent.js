import React, {Component} from 'react'
import { Image, Icon, Modal, Header } from 'semantic-ui-react'

export default class ReviewDetail extends Component {

  render(){
    return(
      <Modal open={this.props.activeModal} closeIcon={true} onClose={this.props.handleClose} className="farsiModal">
      <Modal.Header className="farsiPost"><Header className="modalBandName">{'[' + this.props.review.bandName + ']'}</Header></Modal.Header>
      <Modal.Content image scrolling>
        <Image src={this.props.review.imageUrl}  className="modalImage"/>
        <Modal.Description>
          <Header className="farsiPost">{this.props.review.titleLong || this.props.review.title}</Header>
          {this.props.review.body.split('\n').map(x => <p className={'farsiPost'}>{x}</p>)}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
    </Modal.Actions>
    </Modal>
    )
  }
}