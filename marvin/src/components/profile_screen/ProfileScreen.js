import React from 'react'
import ProfilePlaylistLinks from './ProfilePlaylistLinks';
import profileImage from '../../icons/profile.png'

class ProfileScreen extends React.Component {
    state = {
        playlists: this.props.user.ownedPlaylistsID,
        currView: 0
    }

    viewMyPlaylists = () => {
        this.setState({
            playlists: this.props.user.ownedPlaylistsID,
            currView: 0
        })
    }

    viewSharedPlaylists = () => {
        this.setState({
            playlists: this.props.user.collaborativePlaylistsID,
            currView: 1
        })
    }

    viewFollowedPlaylists = () => {
        this.setState({
            playlists: this.props.user.followedPlaylistsID,
            currView: 2
        })
    }
    
    render () {
        let myPLStyle = (this.state.currView == 0) ? "underline #2C4871" : "underline transparent"
        let sharedStyle = (this.state.currView == 1) ? "underline #2C4871" : "underline transparent"
        let followedStyle = (this.state.currView == 2) ? "underline #2C4871" : "underline transparent"
        return (
            <div className='d-flex h-100 p-0' style={{width: 'calc(100%-200px)'}}>
                <div className='display-inline pl-5 pt-4 w-100'>
                    <div className='display-4 text-white border border-white border-left-0 border-right-0 border-top-0 mb-3'>
                        <img className='rounded-circle mr-3 mb-4' src={profileImage} height='80' width='80'></img>
                        {this.props.user.username}
                        <div className='row'>
                            <div className='h4 ml-3 mr-5' style={{textDecoration: myPLStyle, cursor: "pointer"}} 
                                onClick={this.viewMyPlaylists}>My Playlists</div>
                            <div className='h4 mr-5' style={{textDecoration: sharedStyle, cursor: "pointer"}} 
                                onClick={this.viewSharedPlaylists}>Shared With Me</div>
                            <div className='h4' style={{textDecoration: followedStyle, cursor: "pointer"}} 
                                onClick={this.viewFollowedPlaylists}>Followed Playlists</div>
                        </div>
                    </div>
                    <ProfilePlaylistLinks playlists={this.state.playlists}/>
                </div>
            </div>
        )
    }
}

export default ProfileScreen