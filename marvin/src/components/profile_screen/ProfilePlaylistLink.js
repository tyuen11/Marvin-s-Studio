import gql from 'graphql-tag';
import React from 'react'
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

const GET_PLAYLIST = gql`
    query playlist($id: String!) {
        playlist(id: $id) {
            _id
            title
            privacyType
        }
    }
`

class ProfilePlaylistLink extends React.Component {
    render() {
        let playlist;
        return (
            <Query pollInterval={500} query={GET_PLAYLIST} variables={{ id: this.props.playlistID }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    else playlist = data.playlist;
                    return (
                        playlist == null || (playlist.privacyType == 1 && !this.props.myProfile) ? <div/> : 
                            <Link className='col-3 mb-5 text-playlist p-0' to={`/app/playlist/${playlist._id}`}>
                                <div style={{cursor: 'pointer', width: 150, height: 150}}>
                                    <img className='border rounded border-white w-100 h-100' src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png"></img>
                                    <div className='text-center'>{playlist.title}</div>
                                </div>
                            </Link>
                    )
                }}
            </Query>
        )
    }
}

export default ProfilePlaylistLink