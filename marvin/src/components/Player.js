import React from 'react'
import logo from '../icons/marvins.png';
import ReactPlayer from 'react-player';
import prevButton from '../icons/prev.png'
import playButton from '../icons/play.png'
import pauseButton from '../icons/pause.png'
import nextButton from '../icons/next.png'
import shuffleButton from '../icons/shuffle.png'
import queueButton from '../icons/playlist.png'

class Player extends React.Component {
    constructor () {
        super();
        this.state = {
           playing: false,
           seeking: false,
           played: 0,
           currTime: 0
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
            <div className="row w-100 pl-5 py-1 display-inherit border border-white border-left-0 border-bottom-0 border-right-0"
                    style={{height: 80, bottom: 0, left: 0, zIndex: 99, background: '#232323'}}>
                <ReactPlayer width='0%' height='0%' url="https://www.youtube.com/watch?v=wXhTHyIgQ_U" playing={playing}
                    seeking={seeking}/>
                <img className='mr-3 mt-1' src={logo} style={{height: 60, width: 60}} alt=''></img>
                <button id="prev" className='btn btn-outline-primary border-0 mr-2'
                        style={{cursor: buttonCursor}}>
                    <img src={prevButton} style={{ height: 25 }}/>
                    {/*disabled={playerDisabled}*/}
                </button>
                <button id="playPause" className='btn btn-outline-primary border-0 mr-2'
                        style={{cursor: buttonCursor}} onClick={this.handlePlayPause}>
                    <img src={this.state.playing ? pauseButton : playButton} style={{ height: 25 }}/>
                </button>
                <button id="next" className='btn btn-outline-primary border-0 mr-3'
                        style={{cursor: buttonCursor}}>
                    <img src={nextButton} style={{ height: 25 }}/>
                </button>
                <input id="seek" type='range' min={0} max={0.999999} step='any' className='mr-2' style={{ width: '60%'}}
                    // onMouseDown={this.handleSeekMouseDown} value={played}
                    // onChange={this.handleSeekChange}
                    // onMouseUp={this.handleSeekMouseUp}
                ></input>
                <div className='text-white pt-4 ml-3 mr-4' style={{fontSize: 18}}>{mins}:{secs} </div>
                <button id='shuffle' className='btn btn-outline-primary border-0 ml-auto'
                        style={{cursor: buttonCursor}}>
                    <img src={shuffleButton} style={{ height: 25 }}/>
                </button>
                <button id='queue' className='btn btn-outline-primary border-0 ml-3 mr-4'
                        style={{cursor: buttonCursor}}>
                    <img src={queueButton} style={{ height: 35 }}/>
                </button>
                   
            </div>
        )
    }
}

export default Player