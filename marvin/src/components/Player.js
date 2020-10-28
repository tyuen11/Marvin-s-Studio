import React from 'react'
import logo from '../icons/marvins.png';

class Player extends React.Component {
    constructor () {
        super();
        this.state = {
            queue: [],
            playing: false,
            currSong: null,
            currTime: 0
        }
    }
    render () {
        let playerDisabled = this.state.currSong == null;
        let mins = this.state.currTime / 60;
        let secs = this.state.currTime % 60;
        if (secs < 10) secs = '0' + secs;

        const playerStyle = {
            width: '100%',
            height: 60,
            padding: 10,
            bottom: 0,
            left: 0,
            background: '#232323',
            borderTopStyle: 'solid',
            borderThickness: 1,
            borderColor: 'white',
            z_index: 99,
            position: 'absolute',
            display: 'inherit'
        }

        const buttonStyle = {
            color: playerDisabled ? '#3d8af7' : '#0c59cf',
            background: 'transparent',
            height: 60,
            width: '5.6%',
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            borderStyle: 'none',
            marginRight: '.5%',
            cursor: playerDisabled ? 'not-allowed' : 'pointer'
        }

        const timeStyle = {
            color: 'white',
            fontSize: 18,
            paddingTop: 18,
            paddingLeft: 5,
            marginLeft: '1%',
            marginRight: '3%'
        }

        
        return (
            <div className="Player" style={playerStyle}>
                <img src={logo} style={{height: 60}} alt=''></img>
                <button className='Prev' style={buttonStyle} disabled={playerDisabled}>P</button>
                <button className='PlayPause' style={buttonStyle} disabled = {playerDisabled}>Pl</button>
                <button className='Next' style={buttonStyle} disabled={playerDisabled}>N</button>
                <input type='range' style={{width: '60%', marginLeft: '1%'}} min='0'></input>
                <div className='time' style={timeStyle}>{mins}:{secs} </div>
                <button className='ShuffleQueue' style={buttonStyle} disabled={playerDisabled}>S</button>
            </div>
        )
    }
}

export default Player