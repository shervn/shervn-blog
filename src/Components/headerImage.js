import React from 'react'
import { Image, Header } from 'semantic-ui-react'

const HeaderImage = () => {

  return(
    <div>
    <Header className='headerText'
    as='h5'
    content=''/>
    <Image className='headerImage notinvert' bordered
      src='https://shervn.com/media/blog_cover.png'/>

      </div>
  )
}

export default HeaderImage;