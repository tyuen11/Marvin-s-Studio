import React from 'react'

class Player extends React.Component {
    render () {
        const playerStyle = {
            width: '100%',
            height: 75,
            bottom: 0,
            left: 0,
            background: '#232323',
            borderTopStyle: 'solid',
            borderThickness: 1,
            borderColor: 'white',
            z_index: 99,
            position: 'absolute'
        }

        return (
            <div className="Player" style={playerStyle}>Player</div>
        )
    }
}

export default Player