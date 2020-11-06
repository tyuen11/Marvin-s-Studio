import React from 'react'

class PlaylistLink extends React.Component {
    constructor(props) {
        super(props);
        console.log("Playlist link sidebar")
    }
    render() {
        return (
            <div className='text-white text-center pl-3 mb-1' style={{cursor: 'pointer'}}>{this.props.name}</div>
        )
    }
}

export default PlaylistLink