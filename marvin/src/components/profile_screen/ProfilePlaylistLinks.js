import React from 'react'
import ProfilePlaylistLink from './ProfilePlaylistLink';

class ProfilePlaylistLinks extends React.Component {
    constructor(props) {
        super(props);
        console.log("Profile Playlist Links");
    }

    render() {
        return (
            <div className='row position-absolute' style={{paddingRight:'20%', paddingLeft: 20}}>
                {this.props.playlists.map((playlist) =>(
                    <ProfilePlaylistLink {...playlist}/>
                ))}
            </div>
        )
    }
}

export default ProfilePlaylistLinks