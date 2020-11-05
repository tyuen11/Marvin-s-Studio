import React from 'react'
import PlaylistSong from './PlaylistSong'

class PlaylistSongs extends React.Component {
    constructor(props) {
        super(props);
        console.log("Playlist songs props")
    }

    render () {
        return (
            <div>
                {this.props.songs.map((song) => (
                    <PlaylistSong {...song}/>
                ))}
            </div>
        )
    }
}

export default PlaylistSongs