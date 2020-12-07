import React from 'react'
import { Modal } from 'react-bootstrap'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const UPDATE_PLAYLIST_NAME = gql`
    mutation updatePlaylistName(
        $id: String!
        $title: String!
    ) {
        updatePlaylistName(
            id: $id
            title: $title
        ) {
            _id
        }
    }
`

class EditPlaylistNameModal extends React.Component {
    state = {
        title: this.props.playlist.title
    }

    changePlaylistName = (e) => {
        this.setState({ title: e.target.value })
    }

    render () {
        return (
            <Mutation mutation={UPDATE_PLAYLIST_NAME} key={this.props.playlist._id}>
                {(updatePlaylistName, { loading, error}) => (
                    <div className='container'>
                        <Modal id='editPlaylistNameModal' show={this.props.show} onHide={this.props.handleClose}>
                            <Modal.Header closeButton={true}>
                                <Modal.Title>Edit Playlist Name</Modal.Title>
                            </Modal.Header>
                            <Modal.Body id="editPlaylistNameModalBody">
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    updatePlaylistName({ variables: {
                                        id: this.props.playlist._id,
                                        title: this.state.title
                                    }})
                                }}>
                                    <div className='form-group col-8 text-center mx-auto'>
                                        <label className='mt-2 mb-3'>Enter a new name for your playlist</label>
                                        <input className='form-control mb-4' defaultValue={this.state.title} onChange={this.changePlaylistName}/>
                                        <div className='row mb-4'>
                                            <button type='submit' className='col-6 btn btn-primary ml-2 text-center mx-auto' onClick={this.props.handleClose}>Change Name</button>
                                        </div>
                                    </div>
                                </form>
                                {loading && <p>Loading...</p>}
                                {error && <p>Error...</p>}
                            </Modal.Body>
                        </Modal>
                    </div>
                )}
            </Mutation>
        )
    }
}

export default EditPlaylistNameModal