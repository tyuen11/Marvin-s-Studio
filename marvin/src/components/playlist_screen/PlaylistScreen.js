import React from 'react';
import DeletePlaylistModal from '../modals/DeletePlaylistModal.js';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Query, Mutation } from 'react-apollo'
import * as Icon from 'react-bootstrap-icons'

import playButton from '../../icons/play-button.png'
import shuffleButton from '../../icons/shuffle.png'
import deleteButton from '../../icons/delete.png'
import moreButton from '../../icons/more.png'
import likeButton from '../../icons/like.png'
import dislikeButton from '../../icons/dislike.png'
import EditPlaylistNameModal from '../modals/EditPlaylistNameModal.js';
import CopyPlaylistModal from '../modals/CopyPlaylistModal.js';
import PlaylistSong from './PlaylistSong'
import ChangePrivacyModal from '../modals/ChangePrivacyModal.js';
import CollaboratorSettingsModal from '../modals/CollaboratorSettingsModal.js';
import addToQueueButton from '../../icons/playlist.png'

var arraySort = require('array-sort');

const GET_PLAYLIST = gql`
    query playlist($playlistID: String) {
        playlist(id: $playlistID) {
            _id
            collaborators
            genre
            numPlays
            numTracks
            ownerName
            ownerID
            playlistPoints
            privacyType
            songs {
                title
                videoId
                artistID
                artistName
                albumName
                genre
                albumArt
                lastUpdated
            }
            title
        }
    }
`;
const UPDATE_PLAYLIST_POINTS = gql`
    mutation updatePlaylistPoints(
        $id: String!
        $playlistPoints: Int!
    ) {
        updatePlaylistPoints(
            id: $id
            playlistPoints: $playlistPoints
        ) {
            _id
        }
    }
`

const UPDATE_VOTED_PLAYLISTS = gql`
    mutation updateVotedPlaylists(
        $id: String!
        $votedPlaylists: [VotedPlaylistInput]!
    ) {
    updateVotedPlaylists(
        id: $id
        votedPlaylists: $votedPlaylists
    ) {
        _id
    }
}
`

const UPDATE_USER_POINTS = gql`
    mutation updateUserPoints(
        $id: String!
        $userPoints: Int!
    ) {
    updateUserPoints(
        id: $id
        userPoints: $userPoints
    ) {
        _id
    }
}
`

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
class PlaylistScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("Passed props to playlistScreen");
    }

    state = {
        showDelete: false,
        showEditName: false,
        showDropdown: false,
        showPrivacy: false,
        showCollab: false,
        hasVoted: false,
        playlist: null,
        vote: 0,
        songs: null,
        sort: 0,
        attrSorting: ""
    }

    handleShowCollab = () => {
        this.setState({ showCollab: true })
    }

    handleShowPrivacy = () => {
        this.setState({ showPrivacy: true })
    }

    handleShowDelete = () => {
        this.setState({ showDelete: true });
        console.log("done");
    }

    handleShowEditName = () => {
        this.setState({ showEditName: true })
    }

    handleCloseCollab = () => {
        this.setState({ showCollab: false })
    }

    handleClosePrivacy = () => {
        this.setState({ showPrivacy: false })
    }
    handleShowCopyPlaylist = () => {
        this.setState({ showCopyPlaylist: true })
    }

    handleCloseDelete = () => {
        this.setState({ showDelete: false });
        console.log("dosne");
    }

    handleCloseCopyPlaylist = () => {
        this.setState({ showCopyPlaylist: false });
        console.log("copy done");
    }

    handleCloseEditName = () => {
        this.setState({ showEditName: false })
    }

    toggleDropdown = () => {
        let show = !this.state.showDropdown;
        this.setState({ showDropdown: show })
    }


    toggleDisable = () => {
        for (let k in this.props.user.votedPlaylists) {
            console.log(k)
            if (this.props.user.votedPlaylists[k] === this.props.match.params.id) {
                this.setState({ hasVoted: true });
                console.log('found playlistID in votedplaylists')
            }
        }

        if (this.state.hasVoted) {
            let vote = this.props.user.votedPlaylists.findIndex(x => x.playlistID === this.props.match.params.id).votes
            if (vote == -1) {
                this.setState({ vote: -1 });
                console.log('has already disliked')

            }
            else if (vote == 1) {
                this.setState({ vote: 1 });
                console.log('has already liked')

            }
        }
    }

    handlePlaylistVote = (vote, playlist, updateVotedPlaylists, updatePlaylistPoints, updateUserPoints) => {

        console.log("liking song")
        let votesList = this.props.user.votedPlaylists;
        let idx = votesList.findIndex(votesList => votesList.playlistID === playlist._id);
        let points = playlist.playlistPoints

        //fix this
        let userPoints = this.props.user.userPoints;//GET THE APPROPRIATE USER get the owner's points
        //fix this

        if (idx == -1) { //if hasn't voted already
            votesList.push({ playlistID: playlist._id, votes: vote })
            points += vote
            userPoints += vote
        }
        else {
            if (votesList[idx].votes == vote) { //if clicks on same button again
                points -= vote
                userPoints -= vote
                votesList.splice(idx, 1)

            }

            else {
                points += vote * 2
                userPoints += vote * 2
                votesList[idx].votes = vote;
                //  votesList.push(votedPlaylist)
            }
        }

        updateVotedPlaylists({
            variables: {
                id: this.props.user._id,
                votedPlaylists: votesList
            }
        });

        updateVotedPlaylists({
            variables: {
                id: this.props.user._id,
                votedPlaylists: votesList
            }
        });
        updatePlaylistPoints({
            variables: {
                id: playlist._id,
                playlistPoints: points
            }
        })
        updateUserPoints({
            variables: {
                id: playlist.ownerID,
                userPoints: userPoints
            }
        })
        this.setState({ vote: vote });

    }


    handleSortBy = (dbSongs, e) => {
        let sortBy = e.target.id;
        let songs = this.state.songs;
        let sorted = JSON.parse(JSON.stringify(this.state.songs));
        // Reset sorting by when sorting attribute changes
        let sort = this.state.attrSorting === sortBy ? this.state.sort : 0;

        if (sort == 0) { // If songs are not sorted, sort by A-Z
            arraySort(sorted, sortBy);
            sort += 1;
        }
        else if (sort == 1) {// If the songs are already sorted by A-Z, then sort by Z-A
            arraySort(sorted, sortBy, { reverse: true });
            sort += 1;
        }
        else {
            sorted = dbSongs;
            sort = 0;
        }
        this.setState({ songs: sorted, sort: sort, attrSorting: sortBy });
    }

    render() {
        let playlist;
        let user = this.props.user, collaborators;
        let owned, loggedIn = this.props.user != null;
        let songs, dbSongs;
        let sort = this.state.sort, attrSorting = this.state.attrSorting;
        console.log(this.state.songs);
        return (
            <Mutation mutation={UPDATE_VOTED_PLAYLISTS} >
                {(updateVotedPlaylists, { loading, error }) => (
                    <Mutation mutation={UPDATE_USER_POINTS} >
                        {(updateUserPoints, { loading, error }) => (
                            <Mutation mutation={UPDATE_PLAYLIST_POINTS} key={this.props.user !== null ? this.props.user._id : null} >
                                {(updatePlaylistPoints, { loading, error }) => (

                                    <Mutation mutation={UPDATE_PLAYLIST_SONGS} key={this.props.user !== null ? this.props.user._id : null} >
                                        {(updatePlaylistSongs, { loading, error }) => (

                                            <Query pollInterval={500} query={GET_PLAYLIST} variables={{ playlistID: this.props.match.params.id }}
                                                onCompleted={data => this.state.songs == null || this.state.songs !== data ? this.setState({ songs: data.playlist.songs }) : ""}>
                                                {({ loading, error, data }) => {
                                                    if (loading) return 'Loading...';
                                                    if (error) return `Error! ${error.message}`;
                                                    else {
                                                        playlist = data.playlist;
                                                        owned = loggedIn ? user._id == playlist.ownerID : false;
                                                        collaborators = playlist.collaborators;
                                                        songs = this.state.songs !== null ? this.state.songs : playlist.songs;
                                                        dbSongs = playlist.songs;
                                                    }
                                                    return (
                                                        <div id="playlist" className="playpage" style={{position:'relative' ,left: 20, overflow:'hidden'}} >
                                                            <div className="row border-light" style={{ border: "solid", borderWidth: "1px", borderTopWidth: "0px", borderRightWidth: "0px", borderLeftWidth: "0px" }}>
                                                                <div id="top" className="col ml-3">
                                                                    <div className="row">
                                                                        <div id="playlistInfoAndActions" className="col-8">
                                                                            <div id="playlistName" className="row">
                                                                                <h1 className="text-light ml-4 mt-5">{playlist.title} </h1>
                                                                            </div>
                                                                            <div id="playlistOwner" className="row">
                                                                                <Link to={`/app/profile/${playlist.ownerID}`}>
                                                                                    <h4 className="text-light ml-4"> Playlist by {playlist.ownerName} </h4>
                                                                                </Link>
                                                                            </div>

                                                                            <div id="actions" className="row overflow-visible ml-3" style={{ marginTop: 60 ,  overflow:'hidden'}}>
                                                                                <button className='btn btn-outline-primary border-0 bg-transparent'>
                                                                                    <img src={playButton} style={{ height: 40 }} onClick={this.props.handlePlayPlaylist.bind(this, playlist.songs)} />
                                                                                </button>
                                                                                {owned ?
                                                                                    <button className='btn btn-outline-primary border-0 bg-transparent' onClick={this.handleShowDelete}>
                                                                                        <img src={deleteButton} style={{ height: 40 }} />
                                                                                    </button>
                                                                                    : <div />}
                                                                                <Dropdown direction='right' toggle={this.toggleDropdown} isOpen={this.state.showDropdown}>
                                                                                    <DropdownToggle className='btn btn-outline-primary border-0 bg-transparent' caret={false}>
                                                                                        <img src={moreButton} style={{ height: 40 }} />
                                                                                    </DropdownToggle>
                                                                                    {owned ?
                                                                                        <DropdownMenu>
                                                                                            <DropdownItem onClick={this.handleShowCopyPlaylist}>Copy Playlist</DropdownItem>
                                                                                            <DropdownItem onClick={this.handleShowCollab}>Collaborator Settings</DropdownItem>
                                                                                            <DropdownItem onClick={this.handleShowEditName}>Edit Playlist Name</DropdownItem>
                                                                                            <DropdownItem onClick={this.handleShowPrivacy}>Privacy Settings</DropdownItem>
                                                                                        </DropdownMenu> :
                                                                                        <DropdownMenu>
                                                                                            <DropdownItem onClick={this.handleShowCopyPlaylist}>Copy Playlist</DropdownItem>
                                                                                            <DropdownItem>Follow Playlist</DropdownItem>
                                                                                        </DropdownMenu>
                                                                                    }
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
                                                                                {this.props.user ? <button className='col-2 mx-0 btn btn-outline-primary bg-transparent border-0'
                                                                                    onClick={this.handlePlaylistVote.bind(this, 1, playlist, updateVotedPlaylists, updatePlaylistPoints, updateUserPoints)}>
                                                                                    <img src={likeButton} style={{ height: 25 }} />
                                                                                </button> : <h3 className="text-light">Playlist votes</h3>}
                                                                                <div id="playlistPoints" className="col-3 mx-0 mt-auto h4 text-light text-center">{playlist.playlistPoints}</div>
                                                                                {this.props.user ?
                                                                                    <button className='col-2 mx-0 btn btn-outline-primary bg-transparent border-0'
                                                                                        onClick={this.handlePlaylistVote.bind(this, -1, playlist, updateVotedPlaylists, updatePlaylistPoints, updateUserPoints)}>
                                                                                        <img src={dislikeButton} style={{ height: 25 }} />
                                                                                    </button>
                                                                                    : null}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mt-3 ml-2" >
                                                                <div className="col-3" onClick={this.handleSortBy.bind(this, dbSongs)}>
                                                                    <h3 id="title" style={{ color: "white", cursor: "pointer" }}>Title
                                                    {sort != 0 && attrSorting === "title" ?
                                                                            sort == 1 ? <Icon.ArrowUpShort color='royalblue' /> : <Icon.ArrowDownShort color='royalblue' />
                                                                            : null
                                                                        }
                                                                    </h3>

                                                                </div>
                                                                <div className="col-2" onClick={this.handleSortBy.bind(this, dbSongs)}>
                                                                    <h3 id="artistName" style={{ color: "white", cursor: "pointer" }}>Artist
                                                    {sort != 0 && attrSorting === "artistName" ?
                                                                            sort == 1 ? <Icon.ArrowUpShort color='royalblue' /> : <Icon.ArrowDownShort color='royalblue' />
                                                                            : null
                                                                        }
                                                                    </h3>
                                                                </div>
                                                                <div className="col-2" onClick={this.handleSortBy.bind(this, dbSongs)}>
                                                                    <h3 id="albumName" style={{ color: "white", cursor: "pointer" }}>Album
                                                    {sort != 0 && attrSorting === "albumName" ?
                                                                            sort == 1 ? <Icon.ArrowUpShort color='royalblue' /> : <Icon.ArrowDownShort color='royalblue' />
                                                                            : null
                                                                        }
                                                                    </h3>
                                                                </div>
                                                                <div className="col-3" onClick={this.handleSortBy.bind(this, dbSongs)}>
                                                                    <h3 id="lastUpdated" style={{ color: "white", cursor: "pointer" }}>Date Added
                                                {sort != 0 && attrSorting === "lastUpdated" ?
                                                                            sort == 1 ? <Icon.ArrowUpShort color='royalblue' /> : <Icon.ArrowDownShort color='royalblue' />
                                                                            : null
                                                                        }
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                            <div className="divider song-divider" />

                                                            {songs.map((song, index) => (
                                                                <PlaylistSong key={index} loggedIn={loggedIn} collaborators={collaborators} user={user} index={index} style={{ cursor: 'pointer' }}
                                                                    handleSongChange={this.props.handleSongChange} handleQueueSong={this.props.handleQueueSong}
                                                                    song={song} updatePlaylistSongs={updatePlaylistSongs} playlist={playlist} />
                                                            ))}

                                                            {loggedIn ?
                                                                <div>
                                                                    <DeletePlaylistModal show={this.state.showDelete} handleClose={this.handleCloseDelete} handleShow={this.handleShowDelete}
                                                                        user={this.props.user} history={this.props.history} playlist={playlist} />
                                                                    <EditPlaylistNameModal show={this.state.showEditName} handleClose={this.handleCloseEditName} handleShow={this.handleShowEditName}
                                                                        user={this.props.user} playlist={playlist} />
                                                                    <CopyPlaylistModal show={this.state.showCopyPlaylist} handleClose={this.handleCloseCopyPlaylist} handleShow={this.handleShowCopyPlaylist}
                                                                        user={this.props.user} history={this.props.history} playlist={playlist} />

                                                                    <ChangePrivacyModal show={this.state.showPrivacy} handleClose={this.handleClosePrivacy} handleShow={this.handleShowPrivacy}
                                                                        playlist={playlist} />
                                                                    <CollaboratorSettingsModal show={this.state.showCollab} handleClose={this.handleCloseCollab} handleShow={this.handleShowCollab}
                                                                        playlist={playlist} />
                                                                </div>
                                                                : null}
                                                        </div>
                                                    )
                                                }}
                                            </Query>
                                        )}
                                    </Mutation>
                                )}
                            </Mutation>
                        )}
                    </Mutation>
                )}
            </Mutation>

        )
    }
}

export default PlaylistScreen;
