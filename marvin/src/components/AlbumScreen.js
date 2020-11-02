import React from 'react'

class AlbumScreen extends React.Component {
        render() {
                return (
                        <div id="playlist" className="container" >
                                <div className="row" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                                        <div className="col">
                                                <div className="row">
                                                        <div className="col">
                                                                <div className="row">
                                                                        <h3 className="text-light" style={{ paddingTop: "20px", fontSize: "60px", paddingLeft: "20px" }}> Album Name </h3>
                                                                </div>
                                                                <div className="row">
                                                                        <label className="text-light" style={{ marginLeft: "30px", fontSize: "20px" }}> Album by John Doe </label>
                                                                </div>
                                                                <a href="playBtn">
                                                                        <input type="image" style={{ paddingTop: "25px", marginLeft: "20px", width: "10%" }}
                                                                                src="https://i.imgur.com/N7tVoo7.png">
                                                                        </input>
                                                                </a>
                                                                <a href="shuffleBtn">
                                                                        <input type="image" style={{ width: "11%", marginLeft: "30px" }}
                                                                                src="https://i.imgur.com/T8JZhAk.png">
                                                                        </input>
                                                                </a>
                                                        </div>
                                                        <div className="col s8">
                                                                <div className="row">

                                                                        <a href="albumPic">
                                                                                <input type="image" style={{ width: "48%", marginLeft: "30px" }}
                                                                                        src="https://dalelyles.com/musicmp3s/no_cover.jpg">
                                                                                </input>
                                                                        </a>
                                                                </div>
                                                                <div className="row">
                                                                        <div className="col">
                                                                                <a href="thumbsUp">
                                                                                        <input type="image" style={{ width: "22%", marginLeft: "10px" }}
                                                                                                src="https://i.imgur.com/NYr5rnm.png">
                                                                                        </input>
                                                                                </a>
                                                                        </div>
                                                                        <div className="col">

                                                                                <a href="thumbsDown">
                                                                                        <input type="image" style={{ width: "22%", marginLeft: "-180px" }}
                                                                                                src="https://i.imgur.com/zYcZbNp.png">
                                                                                        </input>
                                                                                </a>
                                                                        </div>
                                                                </div>Î
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                                <div className="row" >

                                        <div className="col s4"> <h3 style={{ color: "white" }}>Title</h3>  </div>
                                        <div className="col s4"> <h3 style={{ color: "white" }}>Runtime </h3>  </div>Î
                                </div>
                        </div>
                )
        }
}

export default AlbumScreen