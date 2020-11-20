import React from 'react'
import { Link } from 'react-router-dom';

class ProfilePlaylistLink extends React.Component {
    constructor(props) {
        super(props);
        console.log("Playlist Link"+ props.playlist.title);
    }

    goToPlaylist = () => {
        console.log("Go to Album" + this.props.playlist.title)
    }

    render() {
        return (
            <Link className='col-3 mb-5 text-white p-0' to='/app/playlist' onClick={() => this.props.playlistCallback(this.props.playlist)}>
                <div style={{cursor: 'pointer', width: 150, height: 150}} onClick={this.goToPlaylist}>
                    <img className='border rounded border-white w-100 h-100' src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png"></img>
                    <div className='text-center'>{this.props.playlist.title}</div>
                </div>
            </Link>
        )
    }
}

export default ProfilePlaylistLink