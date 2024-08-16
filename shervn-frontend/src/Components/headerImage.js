import React, { Component } from 'react'
import { Image, Header } from 'semantic-ui-react'

export default  class HeaderImage extends Component {

render(){
  return(
    <div>
    <Header className='headerText'
    as='h5'
    content=''/>
    <Image className='headerImage notinvert' bordered
      src='https://shervn.com/media/blog_cover.png'
      id={this.props.id} />

      </div>
  )
}
}