import React, { Component } from 'react';
import filestack from 'filestack-js';
const client = filestack.init('YOUR_API_KEY');

const filestackCDN = 'https://cdn.filestackcontent.com';

export default class AddContainer extends Component {

  constructor (props) {
    super(props);
    this.state = { handle: '', transformation: '' };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  filestack = () => {
    return client.pick(
      {
        accept: 'image/*',
        maxSize: 1024 * 1024 * 2,
        transformOptions: {
          transformations: {
            rotate: true,
            circle: true,
            monochrome: true,
            sepia: true,
            crop: {
              aspectRatio: 16 / 9,
            },
          },
        },
      }
    );
  };

  async handleClick () {
    try {
      const { filesUploaded } = await this.filestack();
      const handle = filesUploaded[0].handle;
      this.setState({ handle, transformation: this.setTransformation() });
    } catch (e) {
      console.log(e);
    }
  }

  handleChange = () => {
    this.setState({ transformation: this.setTransformation() });
  }

  setTransformation = () => {
    const { getCompress, getSharpen } = this;
    return filestackCDN + getSharpen() + getCompress();
  }

  getCompress = () => {
    const { resize, resizeWidth } = this;
    return `${resize.checked
      ? `/resize=w:${resizeWidth.value}/compress`
      : '/compress'
    }`;
  }

  getSharpen = () => {
    return `${this.sharpen.checked ? '/sharpen' : ''}`;
  }

  async handleSubmit () {
    try {
      const { handle, transformation } = this.state;
      let response = await fetch(
        'http://localhost:3000/pictures',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: this.title.value,
            handle,
            url: transformation,
          }),
        }
      );
      response = await response.json();
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  render () {
    const { handle, transformation } = this.state;
    return (
      <div className=".col-md-offset-4 media-list">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h2 className="panel-title text-center">
              <span className="glyphicon glyphicon-sunglasses" /> Upload Picture
            </h2>
          </div>
          <div className="panel-body" onChange={this.handleChange} >
            <form name="document-form" noValidate onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  className="form-control"
                  placeholder="Enter the title..."
                  ref={(input) => this.title = input}
                  type="text"
                />
              </div>
              <div className="form-group">
                <label>Compress</label>
                <div className="checkbox">
                  <label>
                    <input
                      ref={(input) => this.resize = input}
                      type="checkbox"
                    /> Resize? (width)
                  </label>
                  <input
                    className="form-control"
                    defaultValue="1000"
                    placeholder="1000"
                    ref={(input) => this.resizeWidth = input}
                    type="text"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Sharpen</label>
                <div className="checkbox">
                  <label>
                    <input
                      ref={(input) => this.sharpen = input}
                      type="checkbox"
                    /> Apply?
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="picture">Photo</label>
                <div className={`thumbnail ${handle ? '' : 'off'}`}>
                  <img className="img-rounded" src={handle ? `${transformation}/${handle}` : ''} />
                </div>
                <div className="text-center dropup">
                  <button className="btn btn-default filepicker" onClick={this.handleClick} type="button" >
                  Upload <span className="caret" />
                  </button>
                </div>
              </div>
              <button className="btn btn-filestack btn-block submit" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
