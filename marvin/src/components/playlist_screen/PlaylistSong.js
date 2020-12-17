
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag';

const UPDATE_RECENTLY_PLAYED = gql`
    mutation updateRecentlyPlayed(
        $id: String!
        $recentlyPlayed: [String]!
    ) {
        updateRecentlyPlayed(
            id: $id
            recentlyPlayed: $recentlyPlayed
        ) {
            _id
        }
    }
`
class PlaylistSong extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let song = this.props.song;
        let playlist = this.props.playlist;
        let loggedIn = this.props.loggedIn, canDelete = loggedIn ? this.props.collaborators.includes(this.props.user.email) || this.props.playlist.ownerID == this.props.user._id : loggedIn;
        return (
            <div>
                <div className="songrow row text-light ml-2" style={{ fontWeight: 450, lineHeight: 3 }}>
                    <a id="songName" className="col-3 text-playlist text-truncate overflow-hidden overflow-ellipsis"
                        //onClick={this.props.handleSongChange.bind(this, this.props.song)}
                        onClick={() => {
                            this.props.updateRecents(this.props.updateRecentlyPlayed, playlist);
                            this.props.handleSongChange(song)
                        }}
                    >{song.title}</a>
                    <label id="artistName" className="col-2 text-nowrap text-truncate overflow-hidden overflow-ellipses">
                        {song.artistName}
                    </label>
                    <label id="albumName" className="col-2 text-nowrap overflow-hidden overflow-ellipses" style={{ textOverflow: 'ellipsis' }}>
                        {song.albumName}
                    </label>
                    <label id="date" className="col-2">{song.lastUpdated.slice(0, 10)}</label>

                    <Icon.List className="col-1 qsong btn btn-outline-primary bg-transparent border-0 my-2 " size={37} onClick={this.props.handleQueueSong.bind(this, song)} />

                    {loggedIn && canDelete ?
                        <Icon.TrashFill id="deleteSong" className='col-1 removesong btn btn-outline-primary bg-transparent border-0  my-2' size={37} onClick={e => {
                            e.preventDefault();
                            // load state and db songs
                            let newPlaylistSongs = playlist.songs;
                            let newStateSongs = this.props.stateSongs

                            // remove song from new state and new db
                            let songToDelete = newStateSongs[this.props.index]
                            newStateSongs.splice(this.props.index, 1);
                            let dbIndex = newPlaylistSongs.findIndex(getSong => getSong.videoId === songToDelete.videoId)
                            if (dbIndex !== -1)
                                newPlaylistSongs.splice(dbIndex, 1)

                            // edit db and state
                            newPlaylistSongs.forEach(song => {
                                delete song['__typename']
                            })
                            this.props.updatePlaylistSongs({
                                variables: {
                                    id: playlist._id,
                                    songs: newPlaylistSongs
                                }
                            })
                            this.props.handleDeleteFromState(this.props.index)
                        }} />


                        : null}

                </div>
                <div className="divider song-divider" style={{ borderColor: '#545454' }} />
            </div>

        )
    }
}

export default PlaylistSong;