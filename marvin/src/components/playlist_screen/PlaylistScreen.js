import React from 'react';
import PlaylistSongs from './PlaylistSongs.js';
import DeletePlaylistModal from '../modals/DeletePlaylistModal.js';

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
            <div id="playlist" className="playpage">
                <div className="row border-light" style={{ border: "solid", borderWidth: "1px", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                    <div id="top" className="col ml-3">
                        <div className="row">
                            <div id="playlistInfoAndActions" className="col-8">
                                <div id="playlistName" className="row">
                                    <h1 className="text-light ml-4 mt-5">{this.props.name} </h1>
                                </div>
                                <div id="playlistOwner" className="row">
                                    <h4 className="text-light ml-4"> Playlist by {this.props.owner} </h4>
                                </div>

                                <div id="actions" className=" ml-3" style={{marginTop:60}}>
                                    <a href="playBtn">
                                        <input type="image" style={{ width: "6%" }}
                                            src="https://i.imgur.com/N7tVoo7.png">
                                        </input>
                                    </a>
                                    <a href="shuffleBtn" className="ml-3">
                                        <input type="image" style={{ width: "7%" }}
                                            src="https://i.imgur.com/T8JZhAk.png">
                                        </input>
                                    </a>
                                    <a id="trash" className="mt-10 ml-4">
                                        <input type="image" style={{ width: "6%" }} onClick={this.handleShow}
                                            src="https://i.imgur.com/jpujrfk.png">
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
                                    <input type="image" style={{ width: "10%", height: "10%" }} className="mx-2"
                                        src="https://i.imgur.com/NYr5rnm.png">
                                    </input>
                                    <label id="playlistPoints" className="text-light">100</label>
                                    <input type="image" style={{ width: "10%", height: "10%" }} className="mx-2"
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
                <PlaylistSongs {...this.props} />
                {/*<DeletePlaylistModal showDelete={this.state.show} handleClose={this.handleClose} handleShow={this.handleShow}/>*/}
            </div>
        )
    }
}

export default PlaylistScreen