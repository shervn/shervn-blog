import React from 'react'
import { Image, Header } from 'semantic-ui-react'
import {getImagePath} from '../utils.js'

const HeaderImage = () => {

  return(
    <div>
    <Header className='headerText'
    as='h5'
    content=''/>
    <Image className='headerImage notinvert'
      src={getImagePath('blog_cover.png')}/>

      </div>
  )
}

export default HeaderImage;