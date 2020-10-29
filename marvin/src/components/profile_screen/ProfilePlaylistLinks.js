import React from 'react'
import ProfilePlaylistLink from './ProfilePlaylistLink';

class ProfilePlaylistLinks extends React.Component {
    constructor(props) {
        super(props);
        console.log("Profile Playlist Links");
    }

    render() {

        const playlistViewStyle = {
            display: "inline-block",
            position: 'relative',
            width: '100%',
            textAlign: 'left'
        }

        return (
            <div className="PlaylistLinks" style={playlistViewStyle}>
                {this.props.playlists.map((playlist) =>(
                    <ProfilePlaylistLink {...playlist}/>
                ))}
            </div>
        )
    }
}

export default ProfilePlaylistLinks