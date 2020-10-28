import React, { Component } from 'react'

class CreatePlaylistModal extends Component {
    render() {
        return (
            <div className="container">
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#createPlaylistModal">
                    Open modal
                </button>
                <div id="createPlaylistModal "className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-light" >Create Playlist</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group col-8 mx-auto text-left">
                                        <label className="text-light mt-2 mb-3">What's the name of your playlist</label>
                                        <input className="form-control mb-4"  placeholder="My Playlist"/>
                                        <button type="button" className="btn btn-primary ml-2">Create Playlist</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreatePlaylistModal;
