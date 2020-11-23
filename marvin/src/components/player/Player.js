import React from 'react'
import logo from '../../icons/marvins.png';
import ReactPlayer from 'react-player';
//import FormattedDuration from 'react-intl-formatted-duration';
import Duration from './Duration'



class Player extends React.Component {
    state = {
        playing: false,
        seeking: false,
        played: 0
    }

    ref = player => {
        this.player = player
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
    }

    handleSeekMouseDown = e => {
        console.log("mousedown");
        this.setState({ seeking: true })
    }
    
    handleSeekMouseUp = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }

    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleProgress = state => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
          this.setState(state)
        }
    } 

    handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
    }

    render () {
        let playerDisabled = this.state.currSong == null;
        let buttonCursor = this.state.playerDisabled ? "disabled" : "not-allowed"

        const playing = this.state.playing, seeking = this.state.seeking, played = this.state.played, duration = this.state.duration;
        let song = "https://www.youtube.com/watch?v=" + this.props.currSong.videoId;
        console.log("song is ", song);
        console.log("player says", this.state.playing);
        console.log(this.state.song);

     
        return (
            <div className="row w-100 pl-5 pt-2 display-inherit border border-white border-left-0 border-bottom-0 border-right-0"
                    style={{height: 80, bottom: 0, left: 0, zIndex: 99, background: '#232323'}}>
                <ReactPlayer width='0%' height='0%' url={song} ref={this.ref}
                    playing={playing}
                    onProgress={this.handleProgress}
                    onDuration={this.handleDuration}
                    onReady={() => console.log('onReady')}
                    seeking={seeking} ref={this.ref}/>
                <img className='mr-3' src={logo} style={{height: 60, width: 60}} alt=''></img>
               
                <button id="prev" src="https://imgur.com/UAuIPlX" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>{'\u23ee'} </button>
               
                <button id="play" src="https://imgur.com/xZlEws8" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40}} onClick={this.handlePlayPause}>{this.state.playing ? '\u23f8' : '\u25b6'} </button>
               
                <button id="next" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>{'\u23ed'} </button>
               
                <input id="seek" type='range' min={0} max={0.999999} step='any' className='w-50 mx-2' 
                    onMouseDown={this.handleSeekMouseDown} value={played}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                />

                <Duration className="text-light  ml-2 mt-4 text-center" seconds={(duration * played)!= NaN ? (duration * played) : 0 } />
                <button className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>S</button>
                <button className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>Q</button>
                   
            </div>
        )
    }
}

export default Player