
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import addToQueueButton from '../../icons/playlist.png'
import deleteButton from '../../icons/delete.png'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class PlaylistSong extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let song = this.props.song;
        let playlist = this.props.playlist;
        let loggedIn = this.props.loggedIn, canDelete = loggedIn?this.props.collaborators.includes(this.props.user) || this.props.playlist.ownerID == this.props.user._id : loggedIn;
        console.log(canDelete);
        return (
            <div>
                <div className="row text-light ml-2">
                    <a id="songName" className="col-3 text-light text-truncate overflow-hidden overflow-ellipsis"
                        onClick={this.props.handleSongChange.bind(this, this.props.song)}>{song.title}</a>
                    <label id="artistName" className="col-2">
                        <Link className='text-white' to={`/app/artist/${song.artistID}`}>
                            {song.artistName}
                        </Link>
                    </label>
                    <label id="albumName" className="col-2 text-nowrap overflow-hidden overflow-ellipses" style={{ textOverflow: 'ellipsis' }}>
                        <Link className='text-white' to='/app/album/'>
                            {song.albumName}
                        </Link>
                    </label>
                    <label id="date" className="col-2">{song.lastUpdated.slice(0,10)}</label>
                    <div id="controls" className='col-2 ml-3'>
                        <button className="btn btn-outline-primary bg-transparent border-0 p-1" onClick={this.props.handleQueueSong.bind(this, song)}>
                            <img src={addToQueueButton} style={{ height: 25 }} />
                        </button>

                        {loggedIn && canDelete ? 
                            <button className='btn btn-outline-primary bg-transparent border-0 p-1 ml-4' onClick={e => {
                                e.preventDefault();
                                let newSongs = playlist.songs;
                                newSongs.splice(this.props.index, 1);
                                newSongs.forEach(song => {
                                    delete song['__typename']
                                })
                                this.props.updatePlaylistSongs({
                                    variables: {
                                        id: playlist._id,
                                        songs: newSongs
                                    }
                                })
                            }}>
                                <img src={deleteButton} style={{ height: 25 }} />
                            </button> 
                        : null }
                    </div>
                </div>
                <div className="divider song-divider"  style={{borderColor:'#545454'}}/>
            </div>

        )
    }
}

export default PlaylistSong;