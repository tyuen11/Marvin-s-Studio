import React, { Component } from 'react'
import {Modal, Button} from 'react-bootstrap'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo'

const UPDATE_USER_PLAYLIST = gql`
    mutation updatePlaylist(
        $id: String!,
        $collaborativePlaylists: [PlaylistInput]!
        $ownedPlaylists: [PlaylistInput]! ) {
            updatePlaylist(
                id: $id
                collaborativePlaylists: $collaborativePlaylists
                ownedPlaylists: $ownedPlaylists) {
                    _id
                }      
        }
`;

class AddSongModal extends Component {
    state = {

    }

    addSong = (playlist, index) => {
        let newPlaylist = playlist;
        let song = this.props.song;
        let artistID = this.props.album.artist[0].browseId;
        let songToAdd = {
            songID: song.videoId,
            title: song.name,
            artistID: artistID,
            albumID: null, // Prop the album id when going to that page from search screen
            genre: null
        }
        newPlaylist.songs.push(songToAdd);
        this.setState({
            playlist: newPlaylist,
            index: index
        })
        console.log(this.state);
    }
    render() {
        let ownedPlaylists = this.props.user.ownedPlaylists;
        let collaborativePlaylists = this.props.user.collaborativePlaylists;
        let combined = ownedPlaylists.concat(collaborativePlaylists);
        console.log(combined);
        console.log(ownedPlaylists);
        console.log(collaborativePlaylists);
        return (
            <Mutation mutation={UPDATE_USER_PLAYLIST} key={this.props.user._id} onCompleted={() => this.props.history.push('/album')}>
            {(updatePlaylist, { loading, error}) => (
                <div className="container">
                    <Modal id="addSongModal" show={this.props.show} onHide={this.props.handleClose}>
                        <Modal.Header closeButton={true}>
                            <Modal.Title>Choose which playlist to add to</Modal.Title>
                        </Modal.Header>
                        <Modal.Body id="addSongModalBody">
                            <form onSubmit={e => {
                                e.preventDefault();
                                // Split the combined back to the two diff playlist types
                                combined[this.state.index] = this.state.playlist;
                                ownedPlaylists = combined.splice(0, ownedPlaylists.length);
                                collaborativePlaylists = combined;
                                updatePlaylist({variables: {
                                    id: this.props.user._id, 
                                    collaborativePlaylists: collaborativePlaylists,
                                    ownedPlaylists: ownedPlaylists 
                                }});
                            }}>
                                <div className="form-group col-8 text-center mx-auto">
                                    {combined.map((playlist, index) => (
                                        <button className="btn default"type="submit" onClick={this.addSong.bind(this, playlist, index)}>{playlist.title}</button>
                                    ))}
                                </div>
                            </form>
                            {loading && <p>Loading...</p>}
                            {error && <p>Errors :( Please try again</p>}
                        </Modal.Body>
                    </Modal>
                </div>
            )}
            </Mutation>
        )
    }
}

export default AddSongModal;