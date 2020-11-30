import React from 'react';
import DeletePlaylistModal from '../modals/DeletePlaylistModal.js';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import playButton from '../../icons/play-button.png'
import shuffleButton from '../../icons/shuffle.png'
import deleteButton from '../../icons/delete.png'
import moreButton from '../../icons/more.png'
import likeButton from '../../icons/like.png'
import dislikeButton from '../../icons/dislike.png'
import addToQueueButton from '../../icons/playlist.png'
import EditPlaylistNameModal from '../modals/EditPlaylistNameModal.js';
import { Query } from 'react-apollo';

const GET_PLAYLIST = gql`
    query playlist($playlistID: String) {
        playlist(id: $playlistID) {
            _id
            genre
            numPlays
            numTracks
            ownerName
            ownerID
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
    }
`;

class PlaylistScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("Passed props to playlistScreen");
    }

    state = {
        showDelete: false,
        showEditName: false,
        showDropdown: false
    }

    handleShowDelete = () => {
        this.setState({ showDelete: true });
        console.log("done");
    }

    handleShowEditName = () => {
        this.setState({ showEditName: true })
    }

    handleCloseDelete = () => {
        this.setState({ showDelete: false });
        console.log("dosne");
    }

    handleCloseEditName = () => {
        this.setState({ showEditName: false })
    }

    toggleDropdown = () => {
        let show = !this.state.showDropdown;
        this.setState({ showDropdown: show })
    }

    render() {
        //let user = this.props.user;
        let playlist;
        return (
            <Query pollInterval={500} query={GET_PLAYLIST} variables={{ playlistID: this.props.match.params.id}}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    else playlist = data.playlist;
                    return(
                        <div id="playlist" className="playpage">
                            <div className="row border-light" style={{ border: "solid", borderWidth: "1px", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                                <div id="top" className="col ml-3">
                                    <div className="row">
                                        <div id="playlistInfoAndActions" className="col-8">
                                            <div id="playlistName" className="row">
                                                <h1 className="text-light ml-4 mt-5">{playlist.title} </h1>
                                            </div>
                                            <div id="playlistOwner" className="row">
                                                <h4 className="text-light ml-4"> Playlist by {playlist.ownerName} </h4>
                                            </div>

                                            <div id="actions" className="row overflow-visible ml-3" style={{marginTop:60}}>
                                                <button className='btn btn-outline-primary border-0 bg-transparent'>
                                                    <img src={playButton} style={{ height: 40 }}/>
                                                </button>
                                                <button className='btn btn-outline-primary border-0 bg-transparent'>
                                                    <img src={shuffleButton} style={{ height: 40 }}/>
                                                </button>
                                                <button className='btn btn-outline-primary border-0 bg-transparent' onClick={this.handleShowDelete}>
                                                    <img src={deleteButton} style={{ height: 40 }}/>
                                                </button>
                                                <Dropdown direction='right' toggle={this.toggleDropdown} isOpen={this.state.showDropdown}>
                                                    <DropdownToggle className='btn btn-outline-primary border-0 bg-transparent' caret={false}>
                                                        <img src={moreButton} style={{ height: 40 }}/>
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem href='#'>Copy Playlist</DropdownItem>
                                                        <DropdownItem href='#'>Add to Library</DropdownItem>
                                                        <DropdownItem href='#'>Share</DropdownItem>
                                                        <DropdownItem href='#' onClick={this.handleShowEditName}>Edit Playlist Name</DropdownItem>
                                                        <DropdownItem href='#'>Privacy Settings</DropdownItem>
                                                    </DropdownMenu>
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
                            {playlist.songs.map((song) => (
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
                            <DeletePlaylistModal show={this.state.showDelete} handleClose={this.handleCloseDelete} handleShow={this.handleShowDelete}
                                user={this.props.user} history={this.props.history} playlist={playlist}/>
                            {/*<EditPlaylistNameModal show={this.state.showEditName} handleClose={this.handleCloseEditName} handleShow={this.handleShowEditName}
                            user={this.props.user} playlist={playlist}/>*/}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default PlaylistScreen