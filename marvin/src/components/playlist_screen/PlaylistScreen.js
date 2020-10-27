import React from 'react'

class PlaylistScreen extends React.Component {
    render() {
        const playlistScreenStyle={
            width: 'calc(100% - 200px)',
            padding: 20,
            background: 'blue'
        }
        
        return (
            <div className='PlaylistScreen' style={playlistScreenStyle}>PlaylistScreen</div>
        )
    }
}

export default PlaylistScreen