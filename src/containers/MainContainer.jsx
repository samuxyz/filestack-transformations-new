import React, { Component } from 'react';
import { Jumbotron, Footer, Thumbnail } from 'components';

export default class MainContainer extends Component {

  constructor (props) {
    super(props);
    this.state = { pictureList: [] };
  }

  async componentDidMount () {
    try {
      const response = await fetch('http://localhost:3000/pictures');
      const pictureList = await response.json();
      this.setState({ pictureList });
    } catch (e) {
      console.log(e);
    }
  }

  render () {
    const { pictureList } = this.state;
    return (
      <div>
        <Jumbotron />
        <div className="container">
          <div className="row">
            {
              pictureList.map((picture, i) => <Thumbnail key={i} {...picture} />)
            }
          </div>

          <hr />

          <Footer />
        </div>
      </div>
    );
  }
}
