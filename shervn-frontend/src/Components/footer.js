import React from 'react'
import { Icon, Image } from 'semantic-ui-react'

const setarPhoto = require('../images/setar.png')

const Footer = () => (

  <div id="footer">
    <Image className='headerImage' id="setarPicture" src={setarPhoto}/>


    <ul id="footerIcons">
      <li><a href="https://soundcloud.com/shervn"><Icon name='soundcloud' /></a></li>
      <li><a href="http://linkedin.com/in/shervin-dehghani/"><Icon name='linkedin' /></a></li>
      <li><a href="https://github.com/shervn/"><Icon name='github' /></a></li>
      <li><a href="mailto:shervin.dehghani@gmail.com"><Icon name='mail' /></a></li>
    </ul>
    <h5 >© shervn 2023</h5>
  </div>
)

export default Footer
