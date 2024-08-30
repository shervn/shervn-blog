import React from 'react'
import { Image, Modal, Header } from 'semantic-ui-react'
import { getImagePath, uid } from '../utils.js';


const ReviewDetail = (props) => {

    return(
      <Modal open={props.activeModal} closeIcon={true} onClose={props.handleClose} className="farsiModal">
      <Modal.Header className="farsiPost"><Header className="modalBandName">{'[' + props.review.bandName + ']'}</Header></Modal.Header>
      <Modal.Content image scrolling>
        <Image src={getImagePath(props.review.imageUrl)}  className="modalImage notinvert"/>
        <Modal.Description>
          <Header className="farsiPost">{props.review.titleLong || props.review.title}</Header>
          {props.review.body.split('\n').map(x => <p className={'farsiPost'} key={uid()}>{x}</p>)}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
    </Modal.Actions>
    </Modal>
    )
}

export default ReviewDetail;