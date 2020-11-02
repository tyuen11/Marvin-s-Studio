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
        let buttonCursor = this.state.playerDisabled ? "disabled" : "not-allowed"
     
        return (
            <div className="row w-100 pl-5 pt-2 position-absolute display-inherit border border-white border-left-0 border-bottom-0 border-right-0"
                    style={{height: 80, bottom: 0, left: 0, zIndex: 99, background: '#232323'}}>
                <img className='mr-3' src={logo} style={{height: 60, width: 60}} alt=''></img>
                <button className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>P</button>
                <button className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled = {playerDisabled}>Pl</button>
                <button className='btn btn-outline-primary border-0 text-primary font-weight-bold mx-3'
                    style={{fontSize: 40, cursor: buttonCursor}} disabled={playerDisabled}>N</button>
                <input type='range' className='w-50 mx-2' min='0'></input>
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