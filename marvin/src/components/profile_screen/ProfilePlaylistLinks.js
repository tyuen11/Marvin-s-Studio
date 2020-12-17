import React from 'react'
import ProfilePlaylistLink from './ProfilePlaylistLink';

class ProfilePlaylistLinks extends React.Component {
    constructor(props) {
        super(props);
        console.log("Profile Playlist Links");
    }

    render() {
        return (
            <div className='row text-wrap w-100' style={{paddingRight:'20%', paddingLeft: 20}}>
                {this.props.playlists.map((playlistID, index) =>(
                    <ProfilePlaylistLink key={index} playlistID={playlistID} myProfile={this.props.myProfile}/>
                ))}
            </div>
        )
    }
}

export default ProfilePlaylistLinks