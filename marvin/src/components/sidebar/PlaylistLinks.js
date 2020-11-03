import React from 'react'
import PlaylistLink from './PlaylistLink.js'

class PlaylistLinks extends React.Component {
    constructor(props) {
        super(props);
        console.log("Playlist links sidebar");
    }

    render() {
        return (
            <div>
               {this.props.playlists.map((playlist) => (
                   <PlaylistLink {...playlist}/>
               ))}
            </div>
        )
    }
}

export default PlaylistLinks