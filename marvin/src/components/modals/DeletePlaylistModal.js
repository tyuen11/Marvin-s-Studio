import React, { Component } from 'react'
import {Modal, Button} from 'react-bootstrap'
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
            collaborativePlaylists {
                genre
                numPlays
                numTracks
                ownerName
                playlistPoints
                privacyType
                songs {
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            followedPlaylists {
                genre
                numPlays
                numTracks
                ownerName
                playlistPoints
                privacyType
                songs {
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            ownedPlaylists {
                _id
                genre
                numPlays
                numTracks
                ownerName
                playlistPoints
                privacyType
                songs {
                    albumID
                    artistID
                    genre
                    title
                }
                title
            }
            recentlyPlayed {
                playlistId
                type
            }
            mostPlayed {
                playlistId
                type
            }
            votedPlaylists {
                playlistID
                votes
            }
        }
    }
`;

class DeletePlaylistModal extends Component {
    render() {
        return (
            <Mutation mutation={UPDATE_USER} key={this.props.id} onCompleted={() => this.props.history.push('/')}>
                {(updateUser, { loading, error }) => (
                    <div className="container">
                        <Modal id="deletePlaylist" show={this.props.show} onHide={this.props.handleClose}>
                            <Modal.Header closeButton={true}>
                                <Modal.Title className="">Delete Playlist</Modal.Title>
                            </Modal.Header>
                            <Modal.Body id="exportModalBody">
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    let newOP = this.props.user.ownedPlaylists;
                                    newOP.forEach(pl => {
                                        delete pl['__typename']
                                        pl.songs.forEach(song => {
                                            delete song['__typename']
                                        })
                                    });
                                    newOP.splice(this.props.index, 1);
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
                                    <div className="form-group col-9 text-center mx-auto">
                                        <label className="mt-2 mb-3 ">Are you sure you want to delete playlist?</label>
                                        <label className="mt-2 mb-3">You will not be able to retrieve it once it is deleted.</label>
                                        <div className="row mb-4">
                                            <Button type="submit" className="col-6 btn btn-primary ml-2 text-center mx-auto" onClick={this.props.handleClose}>Delete Playlist</Button>
                                        </div>
                                    </div>
                                    {loading && <p>Loading...</p>}
                                    {error && <p>Error :O water u doing ( ͡° ͜ʖ ͡°)</p>}
                                </form>
                            </Modal.Body>
                        </Modal>
                    </div>
                )}
            </Mutation>
        )
    }
}

export default DeletePlaylistModal;