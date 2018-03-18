import React from 'react';
import { parse } from 'qs';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';
import ReactPlayer from 'react-player';
import classNames from './Stream.scss';
import * as axios from 'axios';

const styles = {
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  position: 'absolute',
  zIndex: 1000
};

class Stream extends React.Component {
  state = {
    videoSrc: '',
    playing: true,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    hash: '',
    fileid: ''
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.handleVideoSource(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.location.search === newProps.location.search) return;
    this.handleVideoSource(newProps);
  }

  handleVideoSource(props) {
    const params = parse(props.location.search.substr(1));
    setTimeout(() => {
      this.setState({
        videoSrc: `/api/torrent/${params.hash}/${params.fileid}`,
        ...params
      });
    }, 10);
  }

  playPause = () => {
    this.setState({ playing: !this.state.playing });
  };
  stop = () => {
    this.setState({ url: null, playing: false });
  };
  toggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) });
  };
  toggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };
  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };
  onPlay = () => {
    console.log('onPlay');
    this.setState({ playing: true });
  };
  onPause = () => {
    console.log('onPause');
    this.setState({ playing: false });
  };
  onSeekMouseDown = e => {
    this.setState({ seeking: true });
  };
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
  };
  onSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  };
  onProgress = state => {
    console.log('onProgress', state);
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };
  onEnded = () => {
    console.log('onEnded');
    this.setState({ playing: this.state.loop });
  };
  onDuration = duration => {
    console.log('onDuration', duration);
    this.setState({ duration });
  };
  onClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player));
  };

  onVlC = async () => {
    try {
      const res = await axios.post('api/vlc/play/', {
        hash: this.state.hash,
        fileId: this.state.fileid
      });
      this.setState({ playing: false });
    } catch (err) {
      console.log(err);
    }
  };

  ref = player => {
    this.player = player;
  };

  render() {
    const {
      playing,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      videoSrc
    } = this.state;
    const SEPARATOR = ' · ';

    return (
      <div className={classNames.playerWrapper}>
        {/*<video*/}
        {/*style={styles}*/}
        {/*autoPlay*/}
        {/*src={videoSrc}*/}
        {/*height="100%"*/}
        {/*width="100%"*/}
        {/*controls*/}
        {/*/>*/}
        <ReactPlayer
          className={classNames.reactPlayer}
          url={videoSrc}
          // controls={true}
          playing={playing}
          width="100%"
          height="100%"
          ref={this.ref}
          loop={loop}
          playbackRate={playbackRate}
          volume={volume}
          muted={muted}
          onReady={() => console.log('onReady')}
          onStart={() => console.log('onStart')}
          onPlay={this.onPlay}
          onPause={this.onPause}
          onBuffer={() => console.log('onBuffer')}
          onSeek={e => console.log('onSeek', e)}
          onEnded={this.onEnded}
          onError={e => console.log('onError', e)}
          onProgress={this.onProgress}
          onDuration={this.onDuration}
        />

        <table>
          <tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.stop}>Stop</button>
                <button onClick={this.playPause}>
                  {playing ? 'Pause' : 'Play'}
                </button>
                <button onClick={this.onClickFullscreen}>Fullscreen</button>
                <button onClick={this.setPlaybackRate} value={1}>
                  1
                </button>
                <button onClick={this.setPlaybackRate} value={1.5}>
                  1.5
                </button>
                <button onClick={this.setPlaybackRate} value={2}>
                  2
                </button>
                <button onClick={this.onVlC}>Open in VLC</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={this.setVolume}
                />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="muted">Muted</label>
              </th>
              <td>
                <input
                  id="muted"
                  type="checkbox"
                  checked={muted}
                  onChange={this.toggleMuted}
                />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="loop">Loop</label>
              </th>
              <td>
                <input
                  id="loop"
                  type="checkbox"
                  checked={loop}
                  onChange={this.toggleLoop}
                />
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td>
                <progress max={1} value={played} />
              </td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td>
                <progress max={1} value={loaded} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Stream;
