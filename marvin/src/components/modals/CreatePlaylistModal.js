import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo'

const UPDATE_USER = gql`
    mutation updateUser (
        $id: String!
        $collaborativePlaylists: [PlaylistInput]!
        $followedPlaylists: [PlaylistInput]!
        $ownedPlaylists: [PlaylistInput]!
        $recentlyPlayed: [PlayedInput]!
        $mostPlayed: [PlayedInput]!
        $userPoints: Int!
        $votedPlaylists: [VotedPlaylistInput]!
    ) {
        updateUser (
            id: $id
            collaborativePlaylists: $collaborativePlaylists
            followedPlaylists: $followedPlaylists
            ownedPlaylists: $ownedPlaylists
            recentlyPlayed: $recentlyPlayed
            mostPlayed: $mostPlayed
            userPoints: $userPoints
            votedPlaylists: $votedPlaylists
        ) {
            lastUpdated
        }
    }
`;

class CreatePlaylistModal extends Component {
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
        if (this.state.ownerName == null)
			return <div>Loading...</div>
        let user = this.props.user
        this.setState({ownerName: user.userName});
    }

    render() {
        if (this.state.ownerName == null)
			return <div>s</div>
        let user = this.props.user;
        return (
            <Mutation mutation={UPDATE_USER} key={this.props.user._id} onCompleted={() => this.props.history.push('/app/home')}>
                {(updateUser, { loading, error }) => (
                    <div className="container">
                        <Modal id="showCreatePlaylist" show={this.props.show} onHide={this.props.handleClose}>
                            <Modal.Header closeButton={true}>
                                <Modal.Title className="">Create Playlist</Modal.Title>
                            </Modal.Header>
                            <Modal.Body id="exportModalBody">
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    let newPL = {
                                        genre: this.state.genre,
                                        numPlays: this.state.numPlays,
                                        numTracks: this.state.numTracks,
                                        ownerID: this.state.ownerID,
                                        ownerName: this.state.ownerName,
                                        playlistPoints: this.state.playlistPoints,
                                        privacyType: this.state.privacyType,
                                        songs: this.state.songs,
                                        title: this.state.title,
                                    };
                                    let newOP = this.props.user.ownedPlaylists;
                                    newOP.forEach(pl => {
                                        delete pl['__typename']
                                        pl.songs.forEach(song => {
                                            delete song['__typename']
                                        })
                                    })
                                    newOP.push(newPL);
                                    console.log(newOP);
                                    updateUser({ variables: {
                                        id: this.props.user._id,
                                        collaborativePlaylists: this.props.user.collaborativePlaylists,
                                        followedPlaylists: this.props.user.followedPlaylists,
                                        ownedPlaylists: newOP,
                                        recentlyPlayed: this.props.user.recentlyPlayed,
                                        mostPlayed: this.props.user.mostPlayed,
                                        userPoints: this.props.user.userPoints,
                                        votedPlaylists: this.props.user.votedPlaylists
                                    }})
                                }}>
                                    <div className="form-group col-8 text-center mx-auto">
                                        <label className="mt-2 mb-3 ">What's the name of your playlist?</label>
                                        <input className="form-control mb-4"  placeholder="My Playlist" onChange={this.playlistNameChange}/>
                                        <div className="row mb-4">
                                            <Button type="submit" className="col-6 btn btn-primary ml-2 text-center mx-auto" onClick={this.props.handleClose}>Create Playlist</Button>
                                        </div>
                                    </div>
                                </form>
                                {loading && <p>Loading...</p>}
                                {error && <p>Error :O water u doing ( ͡° ͜ʖ ͡°)</p>}
                            </Modal.Body>
                        </Modal>
                    </div>
                )}
            </Mutation>
        )
    }
}

export default CreatePlaylistModal;
