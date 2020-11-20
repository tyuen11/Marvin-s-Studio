import React from 'react'
import logo from '../icons/marvins.png';
import ReactPlayer from 'react-player';

class Player extends React.Component {
    constructor () {
        super();
        this.state = {
           playing: false,
           seeking: false,
           played: 0,
        }
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
    }

    handleSeekMouseDown = e => {
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


    ref = player => {
        this.player = player
    }


    render () {
        let playerDisabled = this.state.currSong == null;
        let mins = this.state.currTime / 60;
        let secs = this.state.currTime % 60;
        if (secs < 10) secs = '0' + secs;
        let buttonCursor = this.state.playerDisabled ? "disabled" : "not-allowed"

        const playing = this.state.playing, seeking = this.state.seeking, played = this.state.seeking;

     
        return (
            <div className="row w-100 pl-5 pt-2 display-inherit border border-white border-left-0 border-bottom-0 border-right-0"
                    style={{height: 80, bottom: 0, left: 0, zIndex: 99, background: '#232323'}}>
                <ReactPlayer width='0%' height='0%' url="https://www.youtube.com/watch?v=wXhTHyIgQ_U" playing={playing}
                    seeking={seeking}/>
                <img className='mr-3' src={logo} style={{height: 60, width: 60}} alt=''></img>
                <button id="prev" src="https://imgur.com/UAuIPlX" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>{'\u23ee'} </button>
                <button id="play" src="https://imgur.com/xZlEws8" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} onClick={this.handlePlayPause}>{this.state.playing ? '\u23f8' : '\u25b6'} </button>
                <button id="next" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>{'\u23ed'} </button>
                <input id="seek" type='range' min={0} max={0.999999} step='any' className='w-50 mx-2' 
                    // onMouseDown={this.handleSeekMouseDown} value={played}
                    // onChange={this.handleSeekChange}
                    // onMouseUp={this.handleSeekMouseUp}
                ></input>
                <div className='text-white pt-4 mx-3' style={{fontSize: 18}}>{mins}:{secs} </div>
                <button className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>S</button>
                <button className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>Q</button>
                   
            </div>
        )
    }
}

export default Player