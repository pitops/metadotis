import React from 'react';
import { parse } from 'qs';

const styles = {
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  position: 'absolute',
  zIndex: 1000
};

class Stream extends React.Component {
  constructor(props) {
    super(props);
    const params = parse(props.location.search.substr(1));
    this.state = {
      videoSrc: `/api/torrent/${params.hash}/${params.fileid}`,
      ...params
    };
  }

  render() {
    const { videoSrc } = this.state;

    return (
      <React.Fragment>
        <video
          style={styles}
          autoPlay
          src={videoSrc}
          height="100%"
          width="100%"
          controls
        />
      </React.Fragment>
    );
  }
}

export default Stream;
