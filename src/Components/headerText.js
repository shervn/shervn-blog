import React, { useEffect, useState } from 'react'
import { Header, Image, Modal, Icon, Button } from 'semantic-ui-react'
import { loadData, getImagePath} from '../utils.js';

const HeaderText = () => {

  const [metadata, setMetadata] = useState([]);
  const [modalOpen, setModelOpen] = useState(false);

  useEffect(() => {
    loadData(setMetadata, 'meta');
  }, []);

  const handleOpen = () => setModelOpen(true)
  const handleClose = () => setModelOpen(false)

  return (
    <div>

      <h5 className='musiclistening'>{metadata.musicprefix}<a href={metadata.musicurl}>{metadata.musictitle}</a> by {metadata.musicartist}</h5>

      <Modal
        trigger={<img alt='flower' onClick={handleOpen} src={getImagePath('asterrisk.png')} className='rotate' />}
        open={modalOpen}
        onClose={handleClose}
        size='small'>
        <Header icon='asterisk' content='F. Fozouni' />
        <Modal.Content>
          <Image className='notinvert' src={getImagePath('fozouni.jpg')} />
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={handleClose} inverted>
            <Icon name='close' /> Close
          </Button>
        </Modal.Actions>
      </Modal>
      <Image className='notinvert' floated='left' src={getImagePath('blog_profile.png')} id="profilepix" size='tiny' circular />
      <Header className='headerText'
        as='h2'
        content={metadata.name}
        subheader={metadata.subtitle}
      />
    </div>
  )
}

export default HeaderText
