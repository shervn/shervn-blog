import React from 'react'
import { Container } from 'semantic-ui-react'


const par = require('../data/aboutme.json');
const t = par.text.map(x =>
  <p className={x.first === true ? 'nicep' : 'post'}>
    {x.first === true ? x.txt : x}
  </p>)

const AboutMe = () => (
  <Container text className="post">
    <br />
    {t}
  </Container>
)

export default AboutMe