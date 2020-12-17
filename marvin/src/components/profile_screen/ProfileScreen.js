import React from 'react'
import ProfilePlaylistLinks from './ProfilePlaylistLinks';
import profileImage from '../../icons/profile.png'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import * as Icon from 'react-bootstrap-icons'
import ProgressBar from 'react-bootstrap/ProgressBar'
const GET_USER = gql`
    query user($id: String!) {
        user(id: $id) {
            _id
            username
            ownedPlaylistsID
            collaborativePlaylistsID
            followedPlaylistsID
            userPoints
        }
    }
`

class ProfileScreen extends React.Component {
    state = {
        currView: 0
    }

    viewMyPlaylists = (getPlaylists) => {
        this.setState({
            playlists: getPlaylists,
            currView: 0
        })
    }

    viewSharedPlaylists = (getPlaylists) => {
        this.setState({
            playlists: getPlaylists,
            currView: 1
        })
    }

    viewFollowedPlaylists = (getPlaylists) => {
        this.setState({
            playlists: getPlaylists,
            currView: 2
        })
    }

    render() {
        let getUser;
        let myProfile;
        let myPLStyle = (this.state.currView == 0) ? "underline #2C4871" : "underline transparent"
        let sharedStyle = (this.state.currView == 1) ? "underline #2C4871" : "underline transparent"
        let followedStyle = (this.state.currView == 2) ? "underline #2C4871" : "underline transparent"
        return (
            <Query pollInterval={500} query={GET_USER} variables={{ id: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading..."
                    if (error) return `Error! ${error.message}`
                    else {
                        getUser = data.user
                        if (getUser._id == this.props.user._id) myProfile = true;
                        if (this.state.playlists == null) this.setState({ playlists: getUser.ownedPlaylistsID })
                    }
                    return (
                        <div className='d-flex h-100 p-0' style={{ width: 'calc(100%-200px)' }}>
                            <div className='display-inline pl-5 pt-4 w-100'>
                                <div className='display-4 text-white ' style={{ marginBottom: 15, border: 'solid', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderColor: "#545454" }}>
                                    <div className="row pb-3">
                                        <img className='rounded-circle mr-3 mb-4' src={profileImage} height='80' width='80'></img>
                                        {getUser.username}
                                        <div className="row position-absolute" style={{ right: '20vh', top: '8vh' }}>
                                            {myProfile ?
                                                <h3 style={{ fontSize: "6vh" }}>
                                                    {getUser.userPoints}
                                                    {getUser.userPoints < 25 ?
                                                        <Icon.MusicNoteBeamed className='ml-3 mb-2' style={{ color: '#cd7f32' }} /> : null}

                                                    {getUser.userPoints >= 50 && getUser.userPoints < 100 ?
                                                        <Icon.MusicNoteBeamed className='ml-3' style={{ color: '#aaa9ad' }} /> : null}

                                                    {getUser.userPoints >= 100 && getUser.userPoints < 250 ?
                                                        <Icon.MusicNoteBeamed className='ml-3' style={{ color: '#e0115f' }} /> : null}

                                                    {getUser.userPoints > 250 ?
                                                        <Icon.MusicNoteBeamed className='ml-3' style={{ color: '#0f52ba' }} /> : null}
                                                    <ProgressBar className='prog' animated now={getUser.userPoints/2.5} style={{height:'13%'}}/>

                                                </h3> : null}
                                        </div>

                                    </div>
                                    <div className='row'>
                                        <div className='h4 ml-3 mr-5' style={{ textDecoration: myPLStyle, cursor: "pointer" }}
                                            onClick={() => this.viewMyPlaylists(getUser.ownedPlaylistsID)}>{myProfile ? "My Playlists" : getUser.username + "'s Playlists"}</div>
                                        <div className='h4 mr-5' style={{ textDecoration: sharedStyle, cursor: "pointer" }}
                                            onClick={() => this.viewSharedPlaylists(getUser.collaborativePlaylistsID)}>Shared With {myProfile ? "Me" : getUser.username}</div>
                                        <div className='h4' style={{ textDecoration: followedStyle, cursor: "pointer" }}
                                            onClick={() => this.viewFollowedPlaylists(getUser.followedPlaylistsID)}>Followed Playlists</div>
                                    </div>
                                </div>
                                {this.state.playlists ? <ProfilePlaylistLinks playlists={this.state.playlists} myProfile={myProfile} /> : <div />}
                            </div>
                        </div>
                    )
                }
                }
            </Query >

        )
    }
}

export default ProfileScreen