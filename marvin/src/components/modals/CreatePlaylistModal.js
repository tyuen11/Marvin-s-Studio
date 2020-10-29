import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap';


class CreatePlaylistModal extends Component {
    render() {
        return (
            <div className="container">
                <Modal id="showCreatePlaylist" show={this.props.show} onHide={this.props.handleClose}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title className="">Create Playlist</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="exportModalBody">
                        <form>
                            <div className="form-group col-8 text-center mx-auto">
                                <label className="mt-2 mb-3 ">What's the name of your playlist?</label>
                                <input className="form-control mb-4"  defaultValue="My Playlist"/>
                                <div className="row mb-4">
                                    <Button type="button" className="col-6 btn btn-primary ml-2 text-center mx-auto">Create Playlist</Button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default CreatePlaylistModal;
