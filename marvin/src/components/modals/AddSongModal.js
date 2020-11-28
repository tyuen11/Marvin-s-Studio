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

    addSong = (playlist, index, flag) => {
        let newPlaylist = playlist;
        let artistID = this.props.album.artist[0].browseId;
        if (!flag) {       
            let song = this.props.song;
            let songToAdd = {
                songID: song.videoId,
                title: song.name,
                artistID: artistID,
                albumID: null, // Prop the album id when going to that page from search screen
                artistName: this.props.album.artist[0].name,
                albumName: this.props.album.title,
                genre: null
            }
            newPlaylist.songs.push(songToAdd);
        }
        else {
            let album = this.props.album;
            album.tracks.forEach(song => {
                let songToAdd= {
                    songID: song.videoId,
                    title: song.name,
                    artistID: artistID,
                    albumID: null,
                    artistName: this.props.album.artist[0].name,
                    albumName: this.props.album.title,
                    genre: null
                }
                newPlaylist.songs.push(songToAdd);
            })
        }
        this.setState({
            playlist: newPlaylist,
            index: index
        })
        console.log(this.state);
        this.props.handleClose();
    }
    render() {
        let ownedPlaylists = this.props.user.ownedPlaylists;
        let collaborativePlaylists = this.props.user.collaborativePlaylists;
        let combined = ownedPlaylists.concat(collaborativePlaylists);
        return (
            <Mutation mutation={UPDATE_USER_PLAYLIST} key={this.props.user._id} onCompleted={() => this.props.history.push('/app/album')}>
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
                                combined.forEach(pl => {
                                    delete pl['__typename']
                                    pl.songs.forEach(song => {delete song['__typename']})
                                })
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
                                        <button className="btn default"type="submit" onClick={this.addSong.bind(this, playlist, index, this.props.flag)}>{playlist.title}</button>
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