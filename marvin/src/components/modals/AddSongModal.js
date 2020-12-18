import React, { Component } from 'react'
import {Modal} from 'react-bootstrap'
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo'

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

const GET_PLAYLIST = gql `
    query playlist($playlistID: String) {
        playlist(id: $playlistID) {
            _id
            title
            songs {
                title
                videoId
                artistID
                artistName
                albumName
                genre
                albumArt
            }
        }
    }
`

class AddSongModal extends Component {
    state = {

    }

    addSong = (playlist, flag) => {
        let songs = playlist.songs;
        let artistID = this.props.album.artist[0].browseId;
        if (!flag) {
            let song = this.props.song;
            let songToAdd = {
                videoId: song.videoId,
                title: song.name,
                artistID: artistID,
                albumID: this.props.albumId, // Prop the album id when going to that page from search screen
                artistName: this.props.album.artist[0].name,
                albumName: this.props.album.title,
                albumArt: this.props.album.thumbnails[3].url,
                genre: null,
            }
            songs.push(songToAdd);
        }
        else {
            let album = this.props.album;
            album.tracks.forEach(song => {
                try {
                    let songToAdd= {
                        videoId: song.videoId,
                        title: song.name,
                        artistID: artistID,
                        albumID: this.props.albumId,
                        artistName: this.props.album.artist[0].name,
                        albumName: this.props.album.title,
                        albumArt: (this.props.album.thumbnails[3]) ? this.props.album.thumbnails[3].url : "https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png",
                        genre: null,
                        lastUpdated: song.lastUpdated
                    }
                    songs.push(songToAdd);
                }
                catch (e) { console.log(e) }
            })
        }
        this.setState({
            songs: songs,
            id: playlist._id
        })
        console.log(this.state);
        this.props.handleClose();
    }
    render() {
        let ownedIDs = this.props.user.ownedPlaylistsID;
        let collabIDs = this.props.user.collaborativePlaylistsID;
        return (
            <Mutation mutation={UPDATE_PLAYLIST_SONGS} key={this.props.user._id} onCompleted={() => this.props.history.push('/app/album')}>
            {(updatePlaylistSongs, { loading, error}) => (
                <div className="container">
                    <Modal id="addSongModal" show={this.props.show} onHide={this.props.handleClose}>
                        <Modal.Header closeButton={true}>
                            <Modal.Title>Choose which playlist to add to</Modal.Title>
                        </Modal.Header>
                        <Modal.Body id="addSongModalBody">
                            <form onSubmit={e => {
                                e.preventDefault();
                                let newSongs = this.state.songs;
                                newSongs.forEach(song => {
                                    delete song['__typename']
                                })
                                updatePlaylistSongs({ variables: {
                                    id: this.state.id,
                                    songs: newSongs
                                }})
                            }}>
                                <div className="form-group col-8 text-center mx-auto">
                                    {ownedIDs.map((id, index) => (
                                        <Query pollInterval={500} query={GET_PLAYLIST} variables={{ playlistID: id }}>
                                            {({ loading, error, data }) => {
                                                let playlist;
                                                if(loading) return 'Loading...';
                                                if(error) return `Error! ${error.message}`;
                                                else playlist = data.playlist;
                                                return(
                                                    <div key={index}>
                                                        <button className="btn default" type="submit" onClick={() => this.addSong(playlist, this.props.flag)}>{playlist.title}</button>
                                                    </div>
                                                )
                                            }}
                                        </Query>
                                    ))}
                                    {collabIDs.map((id, index) => (
                                        <Query pollInterval={500} query={GET_PLAYLIST} variables={{ playlistID: id }}>
                                            {({ loading, error, data }) => {
                                                let playlist;
                                                if(loading) return 'Loading...';
                                                if(error) return `Error! ${error.message}`;
                                                else playlist = data.playlist;
                                                return (
                                                    <div key={index}>
                                                        <button className='btn default' type='submit' onClick={() => this.addSong(playlist, this.props.flag)}>{playlist.title}</button>
                                                    </div>
                                                )
                                            }}
                                        </Query>
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