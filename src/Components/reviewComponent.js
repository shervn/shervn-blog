import React, { useState } from 'react'
import { Dimmer, Card, Image, Icon, Header } from 'semantic-ui-react'
import { getImagePath } from '../utils.js';

import ReviewDetail from './reviewDetailComponent'


const Review = (props) => {

  const [beActive, setBeActive] = useState(window.innerWidth <= 768);
  const [activeModal, setActiveModal] = useState(false);

  const handleShow = () => setBeActive(true || window.innerWidth <= 768);
  const handleHide = () => setBeActive(false || window.innerWidth <= 768);
  const changeActiveModal = () => setActiveModal(!activeModal);
  const closeModal = () => setActiveModal(false);

  const active = beActive;
  const content = <Header size="big" className="farsiTitleWhite">{props.review.bandName}</Header>

    return (
      <div className="farsiCard">
        <ReviewDetail activeModal={activeModal} review={props.review} handleClose={closeModal} />
        <Card>
          <Image as={Dimmer.Dimmable}
            onClick={changeActiveModal}
            blurring={true}
            dimmed={beActive}
            dimmer={{ active, content }}
            onMouseEnter={handleShow}
            onMouseLeave={handleHide}
            src={getImagePath(props.review.imageUrl)} wrapped ui={false}
            className='notinvert'
            size='medium' />
          <Card.Content className='farsiPost'>
            {props.review.title}
          </Card.Content>
          <Card.Content extra>
            <p className='farsiPost'>
              <Icon name='calendar alternate' />
              {' ' + props.review.date}
            </p>
          </Card.Content>
        </Card>
      </div>
    )
}

export default Review;