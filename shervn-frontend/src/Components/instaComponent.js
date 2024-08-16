import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

export default class Insta extends Component {

  componentDidMount () {
    const script = document.createElement("script");

    script.src = "https://cdn.curator.io/published/0ca529fb-7e34-414f-92ab-dba5100385ac.js";
    script.async = true;
    document.body.appendChild(script);
}


  render(){
    
    return (
      <Container className="instaContainer">
      <div id="curator-feed-default-feed-layout"></div>
      </Container>
    )
  }
}