import React from 'react'

class AlbumScreen extends React.Component {
        render() {
                return (
                        <div id="playlist" className="container" >
                                <div className="row" style={{ border: "solid", borderWidth: "1px", borderColor: "white", borderTopWidth: "0px", borderRightWidth: "0px" }}>
                                        <div className="col">

                                                <div className="row">
                                                        <h3 className="text-light" style={{  paddingTop: "20px",fontSize:"60px",paddingLeft:"20px" }}> Album Name </h3>
                                                </div>

                                                <div className="row">
                                                        <label className="text-light" style={{ marginLeft: "30px" ,fontSize:"20px"}}> Album by John Doe </label>
                                                </div>

                                                <div className="row">


                                                        <div className="col">

                                                                <a href="playBtn">
                                                                        <input type="image" style={{ paddingTop: "25px", marginLeft: "20px", width: "7.5%" }}
                                                                                src="https://cdn.pixabay.com/photo/2013/07/12/16/56/play-151523__340.png">
                                                                        </input>
                                                                </a>



                                                                <a href="shuffleBtn">
                                                                        <input type="image" style={{ width: "8%", marginLeft: "30px" }}
                                                                                src="https://creazilla-store.fra1.digitaloceanspaces.com/emojis/56624/shuffle-tracks-button-emoji-clipart-md.png">
                                                                        </input>
                                                                </a>

                                                                <a href="trash">
                                                                        <input type="image" style={{ width: "8%", marginLeft: "30px" }}
                                                                                src="data:image/png;base64,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">
                                                                        </input>
                                                                </a>
                                                                <a href="moreBtn">
                                                                        <input type="image" style={{ width: "8%", marginLeft: "30px" }}
                                                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTRji0oY8QGRLIxPEavTz2xOy8fXi0us--o3A&usqp=CAU">
                                                                        </input>
                                                                </a>

                                                        </div>

                                                        <div className="col">



                                                                <div className="row">

                                                                        <a href="albumPic">
                                                                                <input type="image" style={{ width: "28%", marginLeft: "30px" }}
                                                                                        src="https://dalelyles.com/musicmp3s/no_cover.jpg">
                                                                                </input>
                                                                        </a>
                                                                </div>
                                                      
                                                        </div>

                                                </div>
                                        </div>
                                </div>
                                <div className="row" >
                                        <h3 className="col-4 text-light">
                                                Title
                                        </h3>
                                        <h3 className="col-4 text-light">
                                                Runtime
                                        </h3>
                          
                                </div>


                        </div>
                )
        }
}

export default AlbumScreen