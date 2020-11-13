import React from 'react';
import PlaylistSongs from './PlaylistSongs.js';
import DeletePlaylistModal from '../modals/DeletePlaylistModal.js';
import gql from 'graphql-tag';
import { Query } from "react-apollo";
import { Link } from 'react-router-dom';

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
        console.log(this.state);
        return (
            <Query pollInterval={500} query={GET_USER} variables={{userId: "5fae1de48c7b5940a0fa1667"}}>
                {({ loading, error, data}) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    return (
                        <div id="playlist" className="playpage">
                            <div className="row border-light" style={{ border: "solid", borderWidth: "1px", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                                <div id="top" className="col ml-3">
                                    <div className="row">
                                        <div id="playlistInfoAndActions" className="col-8">
                                            <div id="playlistName" className="row">
                                                <h1 className="text-light ml-4 mt-5">{data.user.ownedPlaylists[0].title} </h1>
                                            </div>
                                            <div id="playlistOwner" className="row">
                                                <h4 className="text-light ml-4"> Playlist by {data.user.ownedPlaylists[0].ownerName} </h4>
                                            </div>

                                            <div id="actions" className=" ml-3" style={{marginTop:60}}>
                                                <a href="playBtn">
                                                    <input type="image" style={{ width: "6%" }}
                                                        src="https://i.imgur.com/N7tVoo7.png">
                                                    </input>
                                                </a>
                                                <a href="shuffleBtn" className="ml-3">
                                                    <input type="image" style={{ width: "11%"}}
                                                        src="https://i.imgur.com/T8JZhAk.png">
                                                    </input>
                                                </a>
                                                <a id="trash" className="ml-4">
                                                    <input type="image" style={{ width: "10%" }}  onClick={this.handleShow}
                                                        src="https://i.imgur.com/jpujrfk.png">
                                                    </input>
                                                </a>
                                                <a id="moreActions" className="ml-4">
                                                    <input type="image" style={{ width: "10%" }}
                                                        src="https://i.imgur.com/6mXgQgP.png">
                                                    </input>
                                                </a>
                                            </div>
                                        </div>

                                        <div id="imgAndVotes" className="col-4 mt-4" >
                                                <div className="row mt-4 mb-2 text-center">
                                                    <a href="albumPic">
                                                        <input type="image" style={{ width: "70%" }}
                                                            src="https://dalelyles.com/musicmp3s/no_cover.jpg">
                                                        </input>
                                                    </a>
                                                </div>
                                                <div className="row mx-2">
                                                    <input type="image" style={{ width: "10%", height:"10%"}} className="mx-2"
                                                        src="https://i.imgur.com/NYr5rnm.png">
                                                    </input>
                                                    <label id="playlistPoints" className="text-light">100</label>
                                                    <input type="image" style={{ width: "10%", height:"10%"}} className="mx-2"
                                                        src="https://i.imgur.com/zYcZbNp.png">
                                                    </input>
                                                </div>Î
                                            </div>
                                    </div>
                                </div>
                            </div> 
                            <div className="row mt-3 ml-3" >
                                <div className="col-2"> <h3 style={{ color: "white" }}>Title</h3>  </div>
                                <div className="col-2"> <h3 style={{ color: "white" }}>Artist </h3>  </div>
                                <div className="col-2"> <h3 style={{ color: "white" }}>Album </h3>  </div>
                                <div className="col-2"> <h3 style={{ color: "white" }}>Date Added </h3>  </div>
                            </div>
                            <div className="divider song-divider" />
                            {data.user.ownedPlaylists[0].songs.map((song) => (
                                <div>
                                    <div className="row text-light ml-3 ">
                                        <label id="songName" className="col-2 text-nowrap overflow-hidden overflow-ellipsis">{song.title}</label>
                                        <label id="artistName" className="col-2">{song.artist}</label>
                                        <label id="albumName" className="col-2 text-nowrap overflow-hidden overflow-ellipses" style={{textOverflow:'ellipsis'}}>
                                            <Link to='/album'>
                                                {song.album}
                                            </Link>
                                        </label>
                                        <label id="date" className="col-3">01-10-1010</label>
                                        <a id="queueBtn" className="col-1" href="addQueue">
                                            <input type="image" style={{ width: "100%" }}
                                                src="https://i.imgur.com/sNVHPL0.png">
                                            </input>
                                        </a>
                                        <a id="deleteSong" className="col-1 mt-1" href="deleteSong">
                                            <input type="image" style={{ width: "55%"}}
                                                src="https://i.imgur.com/jpujrfk.png">
                                            </input>
                                        </a>
                                                        
                                    </div>
                                    <div className="divider song-divider"/>
                                </div>
                            ))}
                            <DeletePlaylistModal show={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow}
                                user={data.user} history={this.props.history} index={0}/>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default PlaylistScreen