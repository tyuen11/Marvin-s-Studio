import React from 'react';
import DeletePlaylistModal from '../modals/DeletePlaylistModal.js';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Query, Mutation } from 'react-apollo'
import * as Icon from 'react-bootstrap-icons'

import EditPlaylistNameModal from '../modals/EditPlaylistNameModal.js';
import CopyPlaylistModal from '../modals/CopyPlaylistModal.js';
import PlaylistSong from './PlaylistSong'
import ChangePrivacyModal from '../modals/ChangePrivacyModal.js';
import CollaboratorSettingsModal from '../modals/CollaboratorSettingsModal.js';
import { Toast } from 'react-bootstrap';

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
const UPDATE_FOLLOWED_PLAYLISTS = gql`
    mutation updateFollowedPlaylists(
        $id: String!
        $followedPlaylistsID: [String]!
    ) {
        updateFollowedPlaylists(
            id: $id
            followedPlaylistsID: $followedPlaylistsID
        ) {
            _id
        }
    }
`

const GET_USER = gql`
    query user($userId: String) {
        user(id: $userId) {
            _id
            email
            password
            username
            userPoints
            collaborativePlaylistsID
            followedPlaylistsID
            ownedPlaylistsID
            recentlyPlayed
            mostPlayed {
                playlistId
                count
            }
            votedPlaylists {
                playlistID
                votes
            }
            votedSOTD
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
        attrSorting: "",
        hovered: false,
        hoveredDown: false,
        owner: null,
        showFollowed: false,
        showUnfollowed: false
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

    handlePlaylistVote = (vote, playlist, updateVotedPlaylists, updatePlaylistPoints, updateUserPoints, owner) => {

        console.log("liking song")
        let votesList = this.props.user.votedPlaylists;
        let idx = votesList.findIndex(votesList => votesList.playlistID === playlist._id);
        let points = playlist.playlistPoints

        //let userPoints = this.state.owner.userPoints;
        let userPoints = owner.userPoints;

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



    updateRecents = (updateRecentlyPlayed, playlist) => {
        let recentlyPlayed = this.props.user.recentlyPlayed;
        let idx = recentlyPlayed.indexOf(playlist._id);

        if (idx == -1) {
            //then push to arr
            recentlyPlayed.push(playlist._id)
        }
        else {
            //slice and append
            recentlyPlayed.splice(idx, 1)
            recentlyPlayed.push(playlist._id)

        }
        updateRecentlyPlayed({
            variables: {
                id: this.props.user._id,
                recentlyPlayed: recentlyPlayed
            }
        });
        //mostplayed here
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

    handleDeleteFromState = (index) => {
        let newSongs = this.state.songs
        newSongs.splice(index, 1)
        this.setState({ songs: newSongs })
    }

    followPlaylist = (user, playlist, updateFollowedPlaylists) => {
        let followedPlaylists = user.followedPlaylistsID
        followedPlaylists.push(playlist._id)
        updateFollowedPlaylists({ variables: { id: user._id, followedPlaylistsID: followedPlaylists } })
        this.handleShowFollowed()
    }

    unfollowPlaylist = (user, playlist, updateFollowedPlaylists) => {
        let followedPlaylists = user.followedPlaylistsID
        let index = followedPlaylists.findIndex(playlistID => playlistID === playlist._id)
        followedPlaylists.splice(index, 1)
        updateFollowedPlaylists({ variables: { id: user._id, followedPlaylistsID: followedPlaylists } })
        this.handleShowUnfollowed()
    }

    handleShowFollowed = () => {
        this.setState({ showFollowed: true })
    }

    handleHideFollowed = () => {
        this.setState({ showFollowed: false })
    }

    handleShowUnfollowed = () => {
        this.setState({ showUnfollowed: true })
    }

    handleHideUnfollowed = () => {
        this.setState({ showUnfollowed: false })
    }

    handleQueuePlaylist = (songs) => {
        for (let x = 0; x < songs.length; x++) {
            this.props.handleQueueSong(songs[x]);
        }
    }

    render() {
        let playlist;
        let user = this.props.user, collaborators;
        let owned, loggedIn = this.props.user != null;
        let songs, dbSongs;
        let sort = this.state.sort, attrSorting = this.state.attrSorting;
        let privacyType;
        console.log(this.state.songs);
        let owner = null;
        let followed
        return (
            <Mutation mutation={UPDATE_FOLLOWED_PLAYLISTS}>
                {(updateFollowedPlaylists, { loading, error }) => (
                    <Mutation mutation={UPDATE_RECENTLY_PLAYED} >
                        {(updateRecentlyPlayed, { loading, error }) => (
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
                                                                        if (this.state.songs == null) this.setState({ songs: playlist.songs })
                                                                        songs = this.state.songs !== null ? this.state.songs : playlist.songs;
                                                                        dbSongs = playlist.songs;
                                                                        followed = loggedIn ? user.followedPlaylistsID.find(playlistID => playlist._id) : null
                                                                        privacyType = playlist.privacyType
                                                                    }
                                                                    return (
                                                                        <Query pollInterval={500} query={GET_USER} variables={{ userId: playlist.ownerID }}>
                                                                            {({ loading, error, data }) => {
                                                                                if (loading) return 'Loading...';
                                                                                if (error) return `Error! ${error.message}`;
                                                                                else owner = data.user;
                                                                                return (
                                                                                    <div id="playlist" className="playpage" style={{ position: 'sticky', left: 15 }} >
                                                                                        <div className="row" >
                                                                                            <div id="top" className="col ml-3 ">
                                                                                                <div className="row">
                                                                                                    <div id="playlistInfoAndActions" className="col-8">
                                                                                                        <div id="playlistName" className="row">
                                                                                                            <h1 className="text-light ml-4 mt-5">{playlist.title + " "}
                                                                                                                {privacyType == 0 ?
                                                                                                                    <Icon.Globe2 color="#3d8af7" size={20} />
                                                                                                                    : <Icon.LockFill color="#3d8af7" size={20} />
                                                                                                                }
                                                                                                                {" "}
                                                                                                                {collaborators.length !== 0 ? <Icon.PeopleFill color="#3d8af7" size={20} /> : null}
                                                                                                            </h1>
                                                                                                        </div>
                                                                                                        <div id="playlistOwner" className="row">
                                                                                                        {data.user && data.user._id !== "5fdc52a21d96445e6ab4d805" ?
                                                                                                            <Link to={`/app/profile/${playlist.ownerID}`}>
                                                                                                                <h4 className="text-light ml-4"> Playlist by {playlist.ownerName} </h4>
                                                                                                            </Link> :
                                                                                                            <h4 className="text-light ml-4"> Playlist by Marvin's Studio</h4>
                                                                                                        }
                                                                                                        </div>
                                                                                                        <div id="actions" className="row overflow-visible ml-3" style={{ marginTop: 60 }}>
                                                                                                            <button className='btn btn-outline-primary border-0 bg-transparent'
                                                                                                                //onClick={this.handlePlayAllP(playlist.songs, updateRecentlyPlayed, playlist)}
                                                                                                                //    updateRecents = (updateRecentlyPlayed, playlist) => {
                                                                                                                onClick={() => {
                                                                                                                    if (loggedIn) this.updateRecents(updateRecentlyPlayed, playlist);
                                                                                                                    this.props.handlePlayPlaylist(songs);
                                                                                                                }
                                                                                                                }>
                                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" fill="currentColor" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                                                                                                    <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                                                                                                </svg>
                                                                                                            </button>
                                                                                                            {owned ?
                                                                                                                <button className='btn btn-outline-primary border-0 bg-transparent' onClick={this.handleShowDelete}>
                                                                                                                    <Icon.TrashFill style={{ fontSize: 43 }} />
                                                                                                                </button>
                                                                                                                : <div />}
                                                                                                            <Dropdown direction='right' toggle={this.toggleDropdown} isOpen={this.state.showDropdown}>
                                                                                                                <DropdownToggle className='btn btn-outline-primary border-0 bg-transparent' caret={false}>
                                                                                                                    <Icon.ThreeDots style={{ fontSize: 54, marginLeft: -5 }} />
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
                                                                                                                        {followed ?
                                                                                                                            <DropdownItem onClick={() => this.unfollowPlaylist(user, playlist, updateFollowedPlaylists)}>Unfollow Playlist</DropdownItem> :
                                                                                                                            <DropdownItem onClick={() => this.followPlaylist(user, playlist, updateFollowedPlaylists)}>Follow Playlist</DropdownItem>
                                                                                                                        }
                                                                                                                        <DropdownItem onClick={this.handleQueuePlaylist.bind(this, songs)}>Queue entire playlist</DropdownItem>
                                                                                                                    </DropdownMenu>
                                                                                                                }
                                                                                                            </Dropdown>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div id="imgAndVotes" className="col-3 ml-2 mt-3" >
                                                                                                        <div className="row mt-4 mb-2 justify-content-center">
                                                                                                            <a>
                                                                                                                <input type="image" style={{ height: 170 }}
                                                                                                                    src={songs[0] ? songs[0].albumArt : "https://dalelyles.com/musicmp3s/no_cover.jpg"}>
                                                                                                                </input>
                                                                                                            </a>
                                                                                                        </div>
                                                                                                        <div className="row justify-content-center">
                                                                                                            {this.props.user ? <button className='col-2 mx-0 btn btn-outline-primary bg-transparent border-0'
                                                                                                                onClick={this.handlePlaylistVote.bind(this, 1, playlist, updateVotedPlaylists, updatePlaylistPoints, updateUserPoints, owner)} onMouseOut={() => this.setState({ hovered: true })}
                                                                                                                onMouseOver={() => this.setState({ hovered: false })}>
                                                                                                                {this.state.vote == 1 ? <Icon.HandThumbsUp style={{ fontSize: 30, marginBottom: 5, color: '#3d8af7' }} /> : <Icon.HandThumbsUp style={{ fontSize: 30, marginBottom: 5, color: 'white', transform: `${this.state.hovered ? 'scale(1,1)' : 'scale(1.2,1.2)'}` }} />}
                                                                                                            </button> : <h3 className="text-light">Playlist votes</h3>}
                                                                                                            <div id="playlistPoints" className="col-3 mx-0 mt-auto h4 text-light text-center" style={{ marginBottom: 12, fontSize: 25 }}>{playlist.playlistPoints}</div>
                                                                                                            {this.props.user ?
                                                                                                                <button className='col-2 mx-0 btn btn-outline-primary bg-transparent border-0'
                                                                                                                    onClick={this.handlePlaylistVote.bind(this, -1, playlist, updateVotedPlaylists, updatePlaylistPoints, updateUserPoints, owner)} onMouseOut={() => this.setState({ hoveredDown: true })}
                                                                                                                    onMouseOver={() => this.setState({ hoveredDown: false })}>
                                                                                                                    {this.state.vote == -1 ? <Icon.HandThumbsDown style={{ fontSize: 30, marginBottom: 5, color: '#3d8af7' }} /> : <Icon.HandThumbsDown style={{ fontSize: 30, marginBottom: 5, color: 'white', transform: `${this.state.hoveredDown ? 'scale(1,1)' : 'scale(1.2,1.2)'}` }} />}
                                                                                                                </button>
                                                                                                                : null}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row mt-1 ml-2" >
                                                                                            <div className="col-3" onClick={this.handleSortBy.bind(this, dbSongs)}>
                                                                                                <h3 id="title" className='text-header'>Title
                                                                                                 {sort != 0 && attrSorting === "title" ?
                                                                                                        sort == 1 ? <Icon.ArrowUpShort color='royalblue' /> : <Icon.ArrowDownShort color='royalblue' />
                                                                                                        : null
                                                                                                    }
                                                                                                </h3>

                                                                                            </div>
                                                                                            <div className="col-2" onClick={this.handleSortBy.bind(this, dbSongs)}>
                                                                                                <h3 id="artistName" className='text-header'>Artist
                                                                                                 {sort != 0 && attrSorting === "artistName" ?
                                                                                                        sort == 1 ? <Icon.ArrowUpShort color='royalblue' /> : <Icon.ArrowDownShort color='royalblue' />
                                                                                                        : null
                                                                                                    }
                                                                                                </h3>
                                                                                            </div>
                                                                                            <div className="col-2" onClick={this.handleSortBy.bind(this, dbSongs)}>
                                                                                                <h3 id="albumName" className='text-header'>Album
                                                                                                {sort != 0 && attrSorting === "albumName" ?
                                                                                                        sort == 1 ? <Icon.ArrowUpShort color='royalblue' /> : <Icon.ArrowDownShort color='royalblue' />
                                                                                                        : null
                                                                                                    }
                                                                                                </h3>
                                                                                            </div>
                                                                                            <div className="col-3" onClick={this.handleSortBy.bind(this, dbSongs)}>
                                                                                                <h3 id="lastUpdated" className='text-header'>Date Added
                                                                                                {sort != 0 && attrSorting === "lastUpdated" ?
                                                                                                        sort == 1 ? <Icon.ArrowUpShort color='royalblue' /> : <Icon.ArrowDownShort color='royalblue' />
                                                                                                        : null
                                                                                                    }
                                                                                                </h3>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="divider song-divider" style={{ borderColor: "#545454" }} />

                                                                                        {
                                                                                            songs.map((song, index) => (
                                                                                                <PlaylistSong key={index} loggedIn={loggedIn} collaborators={collaborators} user={user} index={index} style={{ cursor: 'pointer' }}
                                                                                                    handleSongChange={this.props.handleSongChange} handleQueueSong={this.props.handleQueueSong} updateRecents={this.updateRecents}
                                                                                                    song={song} updatePlaylistSongs={updatePlaylistSongs} playlist={playlist} handleDeleteFromState={this.handleDeleteFromState} stateSongs={this.state.songs} updateRecentlyPlayed={updateRecentlyPlayed} />
                                                                                            ))
                                                                                        }

                                                                                        {
                                                                                            loggedIn ?
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
                                                                                                : null
                                                                                        }
                                                                                        <Toast show={this.state.showFollowed} onClose={this.handleHideFollowed} style={{ top: 10, right: 20, position: "fixed" }}>
                                                                                            <Toast.Header closeButton>Successfully Followed Playlist</Toast.Header>
                                                                                            <Toast.Body className='bg-white rounded-bottom'>Followed {playlist.title}!</Toast.Body>
                                                                                        </Toast>
                                                                                        <Toast show={this.state.showUnfollowed} onClose={this.handleHideUnfollowed} style={{ top: 10, right: 20, position: "fixed" }}>
                                                                                            <Toast.Header closeButton>Successfully Unfollowed Playlist</Toast.Header>
                                                                                            <Toast.Body className='bg-white rounded-bottom'>Unfollowed {playlist.title}</Toast.Body>
                                                                                        </Toast>
                                                                                    </div >
                                                                                )
                                                                            }
                                                                            }
                                                                        </Query >
                                                                    )
                                                                }}
                                                            </Query >
                                                        )}
                                                    </Mutation >
                                                )}
                                            </Mutation >
                                        )}
                                    </Mutation >
                                )}
                            </Mutation >
                        )}
                    </Mutation >
                )}
            </Mutation >
        )
    }
}

export default PlaylistScreen;
