import React from 'react';
import DeletePlaylistModal from '../modals/DeletePlaylistModal.js';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap'
import playButton from '../../icons/play-button.png'
import shuffleButton from '../../icons/shuffle.png'
import deleteButton from '../../icons/delete.png'
import moreButton from '../../icons/more.png'
import likeButton from '../../icons/like.png'
import dislikeButton from '../../icons/dislike.png'
import addToQueueButton from '../../icons/playlist.png'

const GET_USER = gql`
    query user($userId: String) {
        user(id: $userId) {
            _id
            username
            userPoints
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

class PlaylistScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("Passed props to playlistScreen");
    }

    state = {
        show: false
    }

    handleShow = () => {
        this.setState({ show: true });
        console.log("done");
    }

    handleClose = () => {
        this.setState({ show: false });
        console.log("dosne");
    }

    render() {
        let user = this.props.user;
        return (
            <div id="playlist" className="playpage">
                <div className="row border-light" style={{ border: "solid", borderWidth: "1px", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                    <div id="top" className="col ml-3">
                        <div className="row">
                            <div id="playlistInfoAndActions" className="col-8">
                                <div id="playlistName" className="row">
                                    <h1 className="text-light ml-4 mt-5">{this.props.playlist.title} </h1>
                                </div>
                                <div id="playlistOwner" className="row">
                                    <h4 className="text-light ml-4"> Playlist by {this.props.playlist.ownerName} </h4>
                                </div>

                                <div id="actions" className="row ml-3" style={{marginTop:60}}>
                                    <button className='btn btn-outline-primary border-0 bg-transparent'>
                                        <img src={playButton} style={{ height: 40 }}/>
                                    </button>
                                    <button className='btn btn-outline-primary border-0 bg-transparent'>
                                        <img src={shuffleButton} style={{ height: 40 }}/>
                                    </button>
                                    <button className='btn btn-outline-primary border-0 bg-transparent' onClick={this.handleShow}>
                                        <img src={deleteButton} style={{ height: 40 }}/>
                                    </button>
                                    <Dropdown drop='right'>
                                        <Dropdown.Toggle id='more' className='btn btn-outline-primary border-0 bg-transparent'>
                                            <img src={moreButton} style={{ height: 40 }}/>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href='#'>Copy Playlist</Dropdown.Item>
                                            <Dropdown.Item href='#'>Add to Library</Dropdown.Item>
                                            <Dropdown.Item href='#'>Share</Dropdown.Item>
                                            <Dropdown.Item href='#'>Edit Playlist Name</Dropdown.Item>
                                            <Dropdown.Item href='#'>Privacy Settings</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>

                            <div id="imgAndVotes" className="col-3 ml-2 mt-3" >
                                    <div className="row mt-4 mb-2 justify-content-center">
                                        <a href="albumPic">
                                            <input type="image" style={{ height: 170 }}
                                                src="https://dalelyles.com/musicmp3s/no_cover.jpg">
                                            </input>
                                        </a>
                                    </div>
                                    <div className="row justify-content-center">
                                        <button className='col-2 mx-0 btn btn-outline-primary bg-transparent border-0'>
                                            <img src={likeButton} style={{ height: 25 }}/>
                                        </button>
                                        <div id="playlistPoints" className="col-3 mx-0 mt-auto h4 text-light text-center">100</div>
                                        <button className='col-2 mx-0 btn btn-outline-primary bg-transparent border-0'>
                                            <img src={dislikeButton} style={{ height: 25 }}/>
                                        </button>
                                    </div>Î
                                </div>
                        </div>
                    </div>
                </div> 
                <div className="row mt-3 ml-2" >
                    <div className="col-3"> <h3 style={{ color: "white" }}>Title</h3>  </div>
                    <div className="col-2"> <h3 style={{ color: "white" }}>Artist </h3>  </div>
                    <div className="col-2"> <h3 style={{ color: "white" }}>Album </h3>  </div>
                    <div className="col-3"> <h3 style={{ color: "white" }}>Date Added </h3>  </div>
                </div>
                <div className="divider song-divider" />
                {this.props.playlist.songs.map((song) => (
                    <div>
                        <div className="row text-light ml-2 ">
                            <label id="songName" className="col-3 text-truncate overflow-hidden overflow-ellipsis">{song.title}</label>
                            <label id="artistName" className="col-2">
                                <Link className='text-white' to={`/app/artist/${song.artistID}`}>
                                    {song.artistName}
                                </Link>
                            </label>
                            <label id="albumName" className="col-2 text-nowrap overflow-hidden overflow-ellipses" style={{textOverflow:'ellipsis'}}>
                                <Link className='text-white' to='/app/album/'>
                                    {song.albumName}
                                </Link>
                            </label>
                            <label id="date" className="col-2">01-10-1010</label>
                            <div id="controls" className='col-2 ml-3'>
                                <button className="btn btn-outline-primary bg-transparent border-0 p-1">
                                    <img src={addToQueueButton} style={{ height: 25 }} />
                                </button>
                                <button className='btn btn-outline-primary bg-transparent border-0 p-1 ml-4'>
                                    <img src={deleteButton} style= {{ height: 25 }}/>
                                </button>
                            </div>            
                        </div>
                        <div className="divider song-divider"/>
                    </div>
                ))}
                <DeletePlaylistModal show={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow}
                    user={this.props.user} history={this.props.history} index={this.props.index}/>
            </div>
        )
    }
}

export default PlaylistScreen