import gql from 'graphql-tag'
import React, { useState } from 'react'
import { Mutation, useQuery } from 'react-apollo'
import { Modal } from 'react-bootstrap'
import xMarkButton from '../../icons/x-mark.png'

const UPDATE_PLAYLIST_COLLABORATORS = gql`
    mutation updatePlaylistCollaborators(
        $id: String!
        $collaborators: [String]!
    ) {
        updatePlaylistCollaborators(
            id: $id
            collaborators: $collaborators
        ) {
            _id
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

const GET_USERS = gql`
    query users {
        users{
            email
            collaborativePlaylistsID
        }
    }
`

function CollaboratorSettingsModal(props) {
    const [nextCollaborator, setNextCollaborator] = useState("")
    const [collaborators, setCollaborators] = useState([])

    const updateNextCollaborator = (e) => {
        setNextCollaborator(e.target.value)
    }

    const keyPress = (e, collaborators) => {
        if (e.key === "Enter")
            updateCollaborators(collaborators)
    }

    const deleteCollaborator = (index) => {
        let tempCollaborators = [...collaborators]
        tempCollaborators.splice(index, 1)
        setCollaborators(tempCollaborators)
    }

    const updateCollaborators = (collaborators) => {
        let tempCollaborators = [...collaborators]
        tempCollaborators.push(nextCollaborator)
        setNextCollaborator("")
        setCollaborators(tempCollaborators)
    }

    if(nextCollaborator == null){
        setCollaborators([...props.playlist.collaborators])
        setNextCollaborator("")
    }
    
    const {data} = useQuery(GET_USERS)

    return(
        <Mutation mutation={UPDATE_PLAYLIST_COLLABORATORS} key={props.playlist._id}>
            {(updatePlaylistCollaborators, { collaboratorLoading, collaboratorError }) => (
                <Mutation mutation={UPDATE_COLLABORATIVE_PLAYLISTS}>
                    {(updateCollaborativePlaylists, { playlistLoading, playlistError }) => (
                        <Modal id='collaoratorSettingsModal' show={props.show} onHide={props.handleClose}>
                            <Modal.Header closeButton={true}>
                                <Modal.Title>Collaborator Settings</Modal.Title>
                            </Modal.Header>
                            <Modal.Body id='collaboratorSettingsModalBody'>
                                <form onSubmit={e => {
                                    e.preventDefault()

                                    // check if collaborators need to be deleted
                                    let collToDelete = []
                                    props.playlist.collaborators.forEach(currCollaborator => {
                                        let find = collaborators.find(findColl => findColl == currCollaborator)
                                        if (!find) collToDelete.push(currCollaborator)
                                    })
                                    // delete playlist from users' collaborative playlists
                                    collToDelete.forEach(deleteColl => {
                                        if (data) {
                                            let user = data.users.find(user => user.email == deleteColl)
                                            let collabPlaylists = [...user.collaborativePlaylistsID]
                                            let index = collabPlaylists.findIndex(playlistID => playlistID == props.playlist._id)
                                            // check that playlist to delete is in user's set, then delete
                                            if(index != -1) {
                                                collabPlaylists.splice(index, 1);
                                                updateCollaborativePlaylists({ variables: {
                                                    email: user.email,
                                                    collaborativePlaylistsID: collabPlaylists
                                                }})
                                            }
                                        }
                                    })

                                    // check if collaborators need to be added
                                    let collToAdd = []
                                    collaborators.forEach(currCollaborator => {
                                        let find = props.playlist.collaborators.find(findColl => findColl == currCollaborator)
                                        if(!find) collToAdd.push(currCollaborator)
                                    })
                                    // add playlist to each users' collaborative playlists
                                    collToAdd.forEach(addColl => {
                                        if (data) {
                                            let user = data.users.find(user => user.email == addColl)
                                            let collabPlaylists = [...user.collaborativePlaylistsID]
                                            let index = collabPlaylists.findIndex(playlistID => playlistID == props.playlist._id)
                                            // check if playlist to add is not in user's set, if so add playlist
                                            if (index == -1) {
                                                collabPlaylists.push(props.playlist._id)
                                                updateCollaborativePlaylists({ variables: {
                                                    email: user.email,
                                                    collaborativePlaylistsID: collabPlaylists
                                                }})
                                            }}
                                    })
                                    updatePlaylistCollaborators({ variables: {
                                        id: props.playlist._id,
                                        collaborators: collaborators
                                    }})
                                    props.handleClose();
                                }}>
                                    <div className='form-group col-8 text-center mx-auto'>
                                        <div>
                                            {collaborators ? collaborators.map((collaborator, index) => (
                                                <div key={index} className='row mb-1'>
                                                    <div className='col-9 mt-1'>{collaborator}</div>
                                                    <div className='col-2'>
                                                        <button className='btn p-1' onClick={() => deleteCollaborator(index)}>
                                                            <img src={xMarkButton} height={22}></img>
                                                        </button>
                                                    </div>
                                                </div>
                                            )) : <div/>}
                                        </div>
                                        <div className='input-group mb-1'>
                                            <input type='text' className='form-control' value={nextCollaborator} 
                                                onChange={updateNextCollaborator} 
                                                onKeyPress={(e) => keyPress(e, collaborators)}
                                            ></input>
                                            <div className='input-group-append'>
                                                <button className='btn btn-primary' type='button' onClick={() => updateCollaborators(collaborators)}>+</button>
                                            </div>
                                        </div>
                                        <button type='submit' className='btn btn-primary'>Submit</button>
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal>
                    )}
                </Mutation>
            )}
        </Mutation>
            
    )
}

export default CollaboratorSettingsModal