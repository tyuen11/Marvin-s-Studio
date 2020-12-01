import React from 'react'
import logo from '../../icons/marvins.png';
import ReactPlayer from 'react-player';
//import FormattedDuration from 'react-intl-formatted-duration';
import Duration from './Duration'
import prevButton from '../../icons/prev.png'
import playButton from '../../icons/play.png'
import pauseButton from '../../icons/pause.png'
import nextButton from '../../icons/next.png'
import shuffleButton from '../../icons/shuffle.png'
import queueButton from '../../icons/playlist.png'


class Player extends React.Component {
    state = {
        playing: false,
        seeking: false,
        played: 0,
        songs: []
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

    handlePrevSongP = (played) => {
        let x = this.props.handlePrevSong(played);
        if (x == 0) 
            this.player.seekTo(parseFloat(0));
        
    }

    componentDidUpdate = (prevProps) => {
        // If a new song is pressed, automatically start playing the song
        if (prevProps.songs[0] != this.props.songs[0])
            this.setState({playing: true}); 
    }

    render () {
        let playerDisabled = this.state.currSong == null;
        let buttonCursor = this.state.playerDisabled ? "disabled" : "not-allowed"
        
        const playing = this.state.playing, seeking = this.state.seeking, played = this.state.played, duration = this.state.duration;
        let songs = this.props.songs, song, index = this.props.index;
        if (songs[0] != undefined)
            song = "https://www.youtube.com/watch?v=" + songs[index].song.videoId;
        if (played >= 1)
            this.props.handleNextSong();

     
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
               
                {/* <button id="prev" src="https://imgur.com/UAuIPlX" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} onClick={this.handlePrevSongP.bind(this, played)}>{'\u23ee'} </button>
               
                <button id="play" src="https://imgur.com/xZlEws8" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40}} onClick={this.handlePlayPause}>{this.state.playing ? '\u23f8' : '\u25b6'} </button>
               
                <button id="next" className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} onClick={this.props.handleNextSong}>{'\u23ed'} </button> */}
               
                <button id="prev" className='btn btn-outline-primary border-0 mr-2'
                        style={{cursor: buttonCursor}} onClick={this.handlePrevSongP.bind(this, played)}>
                    <img src={prevButton} style={{ height: 25 }}/>
                </button>

                <button id="playPause" className='btn btn-outline-primary border-0 mr-2'
                        style={{cursor: buttonCursor}} onClick={this.handlePlayPause}>
                    <img src={this.state.playing ? pauseButton : playButton} style={{ height: 25 }}/>
                </button>

                <button id="next" className='btn btn-outline-primary border-0 mr-3'
                        style={{cursor: buttonCursor}} onClick={this.props.handleNextSong}>
                    <img src={nextButton} style={{ height: 25 }}/>
                </button>

                <input id="seek" type='range' min={0} max={0.999999} step='any' className='mr-2' style={{ width: '60%'}} 
                    onMouseDown={this.handleSeekMouseDown} value={played}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                />

                <Duration className="text-light  ml-2 mt-4 text-center" seconds={(duration * played)!= NaN ? (duration * played) : 0 } />
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