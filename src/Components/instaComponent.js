import React from 'react'
import { Container } from 'semantic-ui-react'

const Insta = () => {

  const script = document.createElement("script");

  script.src = "https://cdn.curator.io/published/0ca529fb-7e34-414f-92ab-dba5100385ac.js";
  script.async = true;
  document.body.appendChild(script);

  return (
    <Container className="instaContainer">
      <div id="curator-feed-default-feed-layout"></div>
    </Container>
  )
}

export default Insta;

