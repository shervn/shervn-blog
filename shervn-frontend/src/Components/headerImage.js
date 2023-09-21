import React, { Component } from 'react'
import { Image } from 'semantic-ui-react'

export default  class HeaderImage extends Component {

render(){
  return(
    <Image className='headerImage notinvert' bordered = {this.props.border === "True"}
      src={this.props.image}
      id={this.props.id} />
  )
}
}