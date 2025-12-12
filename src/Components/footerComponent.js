import { Icon, Image } from 'semantic-ui-react'
import {getImagePath} from '../utils/general.js';

const Footer = () => {
  
  return(
    
    <div id="footer">
      <Image className='headerImage' id="setarPicture" src={getImagePath("setar.png", "Misc")}/>
      <ul id="footerIcons">
          <li><a href="https://soundcloud.com/shervn"><Icon name='soundcloud' /></a></li>
          <li><a href="https://github.com/shervn/"><Icon name='github' /></a></li>
          <li><a href="mailto:shervin.dehghani@gmail.com"><Icon name='mail' /></a></li>
          <li><a href="https://scholar.google.com/citations?user=YGjd874AAAAJ&hl=en"><Icon name='university' /></a></li>
      </ul>
      <h5 className='englishPost'>© shervn {new Date().getFullYear()}</h5>
      <br/>
    </div>
  )
}

export default Footer
