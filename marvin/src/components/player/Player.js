import React from 'react'
import logo from '../../icons/marvins.png';
import ReactPlayer from 'react-player';
import * as Icon from 'react-bootstrap-icons'

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
        if (this.state.loaded < 0.01 && this.state.playing) // Fixes issue of song still playing even when paused in beginning
            return;
        else
            this.setState({ playing: !this.state.playing });
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
        //console.log('onProgress', state)
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

    handleNextSongP = () => {
        let x = this.props.handleNextSong();
        // if (x == 0) {
        //     this.setState({playing: false});
        //     console.log(this.state.playing);
        //     this.player.seekTo(parseFloat(0));
        //     this.setState({played: 0});
        // }
        this.player.seekTo(parseFloat(0));
        this.setState({played: 0, loaded: 0} ,() => {
            if (x == 0) {
                this.setState({playing: false});
                console.log("setting playing to false");
            }
        }); // Also fixes issue of song still playing even when paused in beginning

    }

    handleShowHideQueue = () => {
        if (this.props.showQueue)
            this.props.handleCloseQueue();
        else
            this.props.handleShowQueue();
    }

    componentDidUpdate = (prevProps) => {
        // If a new song is pressed, automatically start playing the song
        if (prevProps.songs[0] != this.props.songs[0])
            this.setState({playing: true, played: 0, loaded: 0}); 
    }

    render () {
        let playerDisabled = this.state.currSong == null;
        //console.log("playing is ", this.state.playing);
        
        const playing = this.state.playing, seeking = this.state.seeking, played = this.state.played, duration = this.state.duration;
        let shuffle = this.props.shuffle;
        let songs = shuffle?this.props.shuffled:this.props.songs, song, index = shuffle?this.props.shuffled_index:this.props.index;
        if (songs[0] != undefined)
            song = "https://www.youtube.com/watch?v=" + songs[index].song.videoId;
        if (played >= 1)
            this.handleNextSongP();
        let buttonCursor = playing ? "pointer" : "disabled"
        return (
            songs[index] ?
                <div className="row w-100 pl-5 pt-2 display-inherit player"
                        style={{height: 80, bottom: 0, left: 0, zIndex: 99, background: '#323232', border:'solid', borderTopWidth:1, borderBottomWidth:0, borderLeftWidth: 0, borderRightWidth: 0,  borderColor: '#525252'}}>
                    <ReactPlayer width='0%' height='0%' url={song} ref={this.ref}
                        playing={playing}
                        onProgress={this.handleProgress}
                        onDuration={this.handleDuration}
                        onReady={() => console.log('onReady')}
                        seeking={seeking} ref={this.ref}/>
                    <img className='mr-3' src={songs[index].song.albumArt} style={{height: 60, width: 60}} alt=''></img>
                    <div className='mr-1 text-white text-truncate'style={{width: '10%'}}>{songs[index].song.title}
                        <div className='text-white'><small>by {songs[index].song.artistName}</small></div>
                    </div>
                    <button id="prev" className='btn btn-outline-primary border-0 mr-2'
                            style={{cursor: buttonCursor}} onClick={this.handlePrevSongP.bind(this, played)}>
                        <img src={prevButton} style={{ height: 25 }}/>
                    </button>

                    <button id="playPause" className='btn btn-outline-primary border-0 mr-2'
                            style={{cursor: buttonCursor}} onClick={this.handlePlayPause}>
                        <img src={this.state.playing ? pauseButton : playButton} style={{ height: 25 }}/>
                    </button>

                    <button id="next" className='btn btn-outline-primary border-0 mr-3'
                            style={{cursor: buttonCursor}} onClick={this.handleNextSongP.bind()}>
                        <img src={nextButton} style={{ height: 25 }}/>
                    </button>
                    <Duration className="text-light  mr-2 mt-4 text-center" seconds={(duration * played)!= NaN ? (duration * played) : 0 } />
                    
                    <input id="seek" type='range' min={0} max={0.999999} step='any' className='mr-2 w-50'
                        onMouseDown={this.handleSeekMouseDown} value={played}
                        onChange={this.handleSeekChange}
                        onMouseUp={this.handleSeekMouseUp}
                    />
                    <button id='shuffle' className='btn btn-outline-primary border-0 ml-auto'
                            style={{cursor: buttonCursor}} onClick={this.props.handleToggleShuffle}>
                        <Icon.Shuffle color={shuffle?"#3d8af7":"white"}size={30} />
                    </button>
                    
                    <button id='queue' className='btn btn-outline-primary border-0 ml-3 mr-4 mt-1'
                            style={{cursor: buttonCursor}} onClick={this.handleShowHideQueue}>
                        <img src={queueButton} style={{ height: 35 }}/>
                    </button> 
                </div> :
                <div/>
            
        )
    }
}

export default Player