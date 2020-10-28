import React from 'react'
import logo from '../logo.svg'

class Player extends React.Component {
    render () {
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
            color: '#0c59cf',
            background: 'transparent',
            height: 60,
            width: '5.6%',
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            borderStyle: 'none',
            marginRight: '.5%'
        }

        const timeStyle = {
            color: 'white',
            fontSize: 18,
            paddingTop: 18,
            paddingLeft: 5,
            marginLeft: '1%',
            marginRight: '4%'
        }
         

        return (
            <div className="Player" style={playerStyle}>
                <img src={logo} style={{height: 60}} alt=''></img>
                <button className='Prev' style={buttonStyle}>P</button>
                <button className='PlayPause' style={buttonStyle}>Pl</button>
                <button className='Next' style={buttonStyle}>N</button>
                <input type='range' style={{width: '60%', marginLeft: '1%'}} min='0' value='50'></input>
                <div className='time' style={timeStyle}>0:00</div>
                <button className='ShuffleQueue' style={buttonStyle}>S</button>
            </div>
        )
    }
}

export default Player