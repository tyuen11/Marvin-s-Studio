import React from 'react'

class PlaylistLink extends React.Component {
    constructor(props) {
        super(props);
        console.log("Playlist link sidebar")
    }
    render() {
        return (
            <div style={{marginBottom: 5, paddingLeft: 20, textAlign: 'left', cursor: 'pointer'}}>{this.props.name}</div>
        )
    }
}

export default PlaylistLink