import React from 'react'
import { Modal } from 'react-bootstrap'
import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'

const UPDATE_PLAYLIST_PRIVACY = gql`
    mutation updatePlaylistPrivacy(
        $id: String!
        $privacyType: Int!
    ) {
        updatePlaylistPrivacy (
            id: $id
            privacyType: $privacyType
        ) {
            _id
        }
    }
`

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

class ChangePrivacyModal extends React.Component {
    state = {
        privacy: this.props.playlist.privacyType
    }

    privacyPublic = () => {
        this.setState({ privacy: 0 })
    }

    privacyPrivate = () => {
        this.setState({ privacy: 1 })
    }

    render() {
        let publicPlaylists;
        return(
            <Query pollInterval={500} query={GET_COMMUNITY} variables={{ id: "5fc69c8b61fdeb5194781f2f"}}>
                {({loading, error, data}) => {
                    if(loading) return 'Loading...'
                    if(error) return `Error! ${error.message}`
                    else publicPlaylists = data.community.publicPlaylistsID
                    return (
                        <Mutation mutation={UPDATE_PLAYLIST_PRIVACY} key={this.props.playlist._id}>
                            {(updatePlaylistPrivacy, { privLoading, privError }) => (
                                <Mutation mutation={UPDATE_PUBLIC_PLAYLISTS}>
                                    {(updatePublicPlaylists, { pubLoading, pubError }) => (
                                        <div className='container'>
                                            <Modal id='changePrivacyModal' show={this.props.show} onHide={this.props.handleClose}>
                                                <Modal.Header closeButton={true}>
                                                    <Modal.Title>Change Privacy Status</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body id='changePrivacyModalBody'>
                                                    <form onSubmit={e => {
                                                        e.preventDefault();
                                                        // update privacy in playlist
                                                        updatePlaylistPrivacy({ variables: {
                                                            id: this.props.playlist._id,
                                                            privacyType: this.state.privacy
                                                        }})
                                                        // determine if playlist is in publicPlaylists
                                                        let inPublic = false;
                                                        let index = 0;
                                                        publicPlaylists.forEach((id, i) => {
                                                            if (id === this.props.playlist._id) {
                                                                inPublic = true;
                                                                index = i;
                                                            }
                                                        })
                                                        // if playlist is public and not in publicPlaylists, add
                                                        if (this.state.privacy === 0 && !inPublic)
                                                            publicPlaylists.push(this.props.playlist._id)
                                                        // if playlist is private and in publicPlaylists, remove
                                                        if(this.state.privacy !== 0 && inPublic)
                                                            publicPlaylists.splice(index, 1)
                                                        // update public playlists
                                                        updatePublicPlaylists({ variables: {
                                                            id: "5fc69c8b61fdeb5194781f2f",
                                                            publicPlaylistsID: publicPlaylists
                                                        }})
                                                    }}>
                                                        <div className='form-group col-8 text-center mx-auto'>
                                                            <div className='radio' onClick={this.privacyPublic}>
                                                                <label>
                                                                    <input type='radio' name='optradio' className='mr-2' checked={this.state.privacy === 0}></input>
                                                                    Public
                                                                </label>
                                                            </div>
                                                            <div className='radio' onClick={this.privacyPrivate}>
                                                                <label>
                                                                    <input type='radio' name='optradio' className='mr-2' checked={this.state.privacy === 1}></input>
                                                                    Private
                                                                </label>
                                                            </div>
                                                            <button type='submit' className='col-6 btn btn-primary mt-2 text-center mx-auto' onClick={this.props.handleClose}>Submit</button>
                                                        </div>
                                                    </form>
                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                    )}
                                </Mutation>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        )
    }
}

export default ChangePrivacyModal