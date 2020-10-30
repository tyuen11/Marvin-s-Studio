import React from 'react'
import Player from '../Player';
import Sidebar from '../sidebar/Sidebar';
import ProfilePlaylistLinks from './ProfilePlaylistLinks';

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("ProfileScreen");
    }
    
    render () {
        return (
            <div className='container d-flex w-100 h-100 position-fixed p-0'>
                <Sidebar {...this.props}/>
                <Player/>
                <div className='container px-5 py-4'>
                    <div className='display-4 text-white border border-white border-left-0 border-right-0 border-top-0 mb-3'>
                        <img className='rounded-circle mr-3 mb-4' src={this.props.profile.image} height='80' width='80'></img>
                        {this.props.profile.name}
                        <div className='h4'>My Playlists</div>
                    </div>
                    <ProfilePlaylistLinks {...this.props.profile}/>
                </div>
            </div>
        )
    }
}

export default ProfileScreen