import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo'
import { GET_PLAYLIST } from '../sidebar/Sidebar'

const ADD_PLAYLIST = gql`
    mutation addPlaylist (
        $id: String!
        $username: String!
        $title: String!
    ) {
        addPlaylist (
            id: $id
            username: $username
            title: $title
        ) {
            _id
        }
    }
`;
const UPDATE_PLAYLIST_SONGS = gql`
    mutation updatePlaylistSongs(
        $id: String!
        $songs: [SongInput]!
    ) {
        updatePlaylistSongs(
            id: $id
            songs: $songs
        ) {
            _id
        }
    }
`

const UPDATE_PLAYLIST_IDS = gql`
    mutation updatePlaylistIDs (
        $id: String!
        $ownedPlaylistsID: [String]!
        $collaborativePlaylistsID: [String]!
        $followedPlaylistsID: [String]!
    ) {
        updatePlaylistIDs (
            id: $id
            ownedPlaylistsID: $ownedPlaylistsID
            collaborativePlaylistsID: $collaborativePlaylistsID
            followedPlaylistsID: $followedPlaylistsID
        ) {
            _id
        }
    }
`

class CopyPlaylistModal extends Component {
    state = {
        genre: "",
        numPlays: 0,
        numTracks: 0,
        ownerName: this.props.user.username,
        ownerID: this.props.user._id,
        playlistPoints: 0,
        privacyType: 0,
        songs: [],
        title: ""
    }

    playlistNameChange = (e) => {
        this.setState({ title: e.target.value })
    }

    componentDidMount = () => {
        if (this.state.ownername == null)
            return <div>Loading...</div>
        let user = this.props.user
        this.setState({ ownerName: user.username });
    }

    render() {
        if (this.state.ownerName == null)
            return <div>s</div>
        let user = this.props.user;
        return (
            <Mutation mutation={ADD_PLAYLIST} key={user._id} refetchQueries={[{ query: GET_PLAYLIST }]}>
                {(addPlaylist, { addLoading, addError }) => (
                    <Mutation mutation={UPDATE_PLAYLIST_IDS} key={user._id}>
                        {(updatePlaylistIDs, { updateLoading, updateError }) => (
                            <Mutation mutation={UPDATE_PLAYLIST_SONGS} key={user._id}>
                                {(updatePlaylistSongs, { addLoading, addError }) => (
                                    <div className="container">
                                        <Modal id="showCreatePlaylist" show={this.props.show} onHide={this.props.handleClose}>
                                            <Modal.Header closeButton={true}>
                                                <Modal.Title className="">Copy Playlist</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body id="exportModalBody">
                                                <form onSubmit={e => {
                                                    e.preventDefault();
                                                    addPlaylist({
                                                        variables: {
                                                            id: user._id,
                                                            username: user.username,
                                                            title: this.state.title
                                                        }
                                                    }).then(res => {
                                                        let playlistID = res.data.addPlaylist._id;
                                                        let songs= this.props.playlist.songs
                                                        console.log('right here')
                                                        console.log(songs)
                                                        songs.forEach(song => {
                                                            delete song['__typename']
                                                        })
                                                        updatePlaylistSongs({
                                                            variables: {
                                                                id: playlistID,
                                                                songs: songs
                                                            }
                                                        })
                                                        let ownedIDs = user.ownedPlaylistsID;
                                                        ownedIDs.push(playlistID);
                                                        updatePlaylistIDs({
                                                            variables: {
                                                                id: user._id,
                                                                ownedPlaylistsID: ownedIDs,
                                                                collaborativePlaylistsID: user.collaborativePlaylistsID,
                                                                followedPlaylistsID: user.followedPlaylistsID
                                                            }
                                                        }).then(this.props.history.push(`/app/playlist/${playlistID}`))
                                                    })
                                                }}>
                                                    <div className="form-group col-8 text-center mx-auto">
                                                        <label className="mt-2 mb-3 ">What's the name of your playlist?</label>
                                                        <input className="form-control mb-4" placeholder="My Playlist" onChange={this.playlistNameChange} />
                                                        <div className="row mb-4">
                                                            <Button type="submit" className="col-6 btn btn-primary ml-2 text-center mx-auto" onClick={this.props.handleClose}>Create Playlist</Button>
                                                        </div>
                                                    </div>
                                                </form>
                                                {(addLoading || updateLoading) && <p>Loading...</p>}
                                                {(addError || updateError) && <p>Error :O water u doing ( ͡° ͜ʖ ͡°)</p>}
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                )}
                            </Mutation>
                        )}
                    </Mutation>
                )}
            </Mutation>
        )
    }
}

export default CopyPlaylistModal;
