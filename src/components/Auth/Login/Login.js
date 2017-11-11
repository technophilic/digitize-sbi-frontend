import React, { Component } from 'react';
import { Textfield } from 'react-mdl/lib/Textfield';
import Button from 'react-mdl/lib/Button';
import { Card, CardText, CardTitle, CardActions } from 'react-mdl/lib/Card';

class Login extends Component {
    render() {
      return (
        <Card shadow={0} style={{width: '512px', margin: 'auto'}}>
            <CardTitle style={{color: '#fff', height: '176px', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'}}>Welcome</CardTitle>
            <CardText>
              <Textfield
                  onChange={() => {}}
                  label="Text..."
                  floatingLabel
                  style={{width: '200px'}}
              />
              <Textfield
                  onChange={() => {}}
                  label="Text..."
                  floatingLabel
                  style={{width: '200px'}}
              />
            </CardText>
            <CardActions border>
                <Button colored>Login</Button>
            </CardActions>
        </Card>
      );
    }
}
export default Login;
