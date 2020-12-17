import React, { Component } from 'react'
import {Modal, Button} from 'react-bootstrap'
import gql from 'graphql-tag';
import { Mutation, useMutation, useQuery } from 'react-apollo'

/*
    QUERY AND MUTATION TO REMOVE PL FROM COLLABORATORS
*/
const GET_USERS = gql`
    query users {
        users {
            email
            collaborativePlaylistsID
        }
    }
`

const UPDATE_COLLABORATIVE_PLAYLISTS = gql`
    mutation updateCollaborativePlaylists(
        $email: String!
        $collaborativePlaylistsID: [String]!
    ) {
        updateCollaborativePlaylists(
            email: $email
            collaborativePlaylistsID: $collaborativePlaylistsID
        ) {
            email
        }
    }
`

/*
    QUERY AND MUTATION TO UPDATE PUBLIC PLAYLISTS
*/

const UPDATE_PUBLIC_PLAYLISTS = gql`
    mutation updatePublicPlaylists(
        $id: String!
        $publicPlaylistsID: [String]!
    ) {
        updatePublicPlaylists (
            id: $id
            publicPlaylistsID: $publicPlaylistsID
        ) {
            _id
        }
    }
`

const GET_COMMUNITY = gql`
    query community($id: String!) {
        community(id: $id) {
            publicPlaylistsID
        }
    }
`

/*
    MUTATIONS TO REMOVE PLAYLIST FROM PLAYLISTS AND USER
*/
const REMOVE_PLAYLIST = gql `
mutation removePlaylist($playlistID: String!) {
    removePlaylist(id: $playlistID) {
        _id
    }
}
`;

const UPDATE_PLAYLIST_IDS = gql`
mutation updatePlaylistIDs (
    $id: String!
    $ownedPlaylistsID: [String]!
    $collaborativePlaylistsID: [String]!
    $followedPlaylistsID: [String]!
) {
    updatePlaylistIDs (
        id: $id
        ownedPlaylistsID: $ownedPlaylistsID
        collaborativePlaylistsID: $collaborativePlaylistsID
        followedPlaylistsID: $followedPlaylistsID
    ) {
        _id
    }
}
`

function DeletePlaylistModal (props) {
    const {data: usersData} = useQuery(GET_USERS)
    const {data: communityData} = useQuery(GET_COMMUNITY, {variables: {id: "5fc69c8b61fdeb5194781f2f"}})
    
    const [removePlaylist] = useMutation(REMOVE_PLAYLIST)
    const [updatePlaylistIDs] = useMutation(UPDATE_PLAYLIST_IDS)
    const [updatePublicPlaylists] = useMutation(UPDATE_PUBLIC_PLAYLISTS)
    const [updateCollaborativePlaylists] = useMutation(UPDATE_COLLABORATIVE_PLAYLISTS)
    
    let user = props.user;
    let playlist = props.playlist;
    return (
        <Modal id="deletePlaylist" show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton={true}>
                <Modal.Title className="">Delete Playlist</Modal.Title>
            </Modal.Header>
            <Modal.Body id="exportModalBody">
                <form onSubmit={e => {
                    e.preventDefault();
                    // remove playlists from collaborators' set
                    playlist.collaborators.forEach(currCollaborator => {
                        let delCollaborator = usersData.users.find(currUser => currUser.email == currCollaborator)
                        let newCollabPL = [...delCollaborator.collaborativePlaylistsID]
                        let collabIndex = newCollabPL.findIndex(playlistID => playlistID == props.playlist._id)
                        if (collabIndex != -1) {
                            newCollabPL.splice(collabIndex, 1)
                            updateCollaborativePlaylists({ variables: {
                                email: delCollaborator.email,
                                collaborativePlaylistsID: newCollabPL
                            }})
                        }
                    })

                    // remove playlist from public playlists
                    let pubPLIndex = communityData.community.publicPlaylistsID.findIndex(playlistID => playlistID == props.playlist._id)
                    if (pubPLIndex != -1) {
                        communityData.community.publicPlaylistsID.splice(pubPLIndex, 1)
                        updatePublicPlaylists({ variables: {
                            id: "5fc69c8b61fdeb5194781f2f",
                            publicPlaylistsID: communityData.community.publicPlaylistsID
                        }})
                    }

                    // remove playlist from playlists and user's set
                    let index = user.ownedPlaylistsID.indexOf(playlist._id);
                    if (index > -1) {
                        user.ownedPlaylistsID.splice(index, 1);
                        removePlaylist({ variables: { playlistID: playlist._id }})
                        updatePlaylistIDs({ variables: {
                            id: user._id,
                            ownedPlaylistsID: user.ownedPlaylistsID,
                            collaborativePlaylistsID: user.collaborativePlaylistsID,
                            followedPlaylistsID: user.followedPlaylistsID
                        }}).then(props.history.push('/app/home'))
                    }
                    else throw new Error('Playlist not owned')
                }}>
                    <div className="form-group col-9 text-center mx-auto">
                        <label className="mt-2 mb-3 ">Are you sure you want to delete playlist?</label>
                        <label className="mt-2 mb-3">You will not be able to retrieve it once it is deleted.</label>
                        <div className="row mb-4">
                            <Button type="submit" className="col-6 btn btn-danger ml-2 text-center mx-auto" onClick={props.handleClose}>Delete Playlist</Button>
                        </div>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default DeletePlaylistModal;