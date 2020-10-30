import React from 'react'

class ProfilePlaylistLink extends React.Component {
    constructor(props) {
        super(props);
        console.log("Playlist Link"+ props.title);
    }

    goToPlaylist = () => {
        console.log("Go to Album" + this.props.title)
    }

    render() {
        const playlistImgStyle = {
            borderRadius: 10,
            borderStyle: 'solid',
            borderThickness: 1,
            borderColor: 'white',
            height: 90
        }

        return (
            <div className='col s4' style={{display: 'inline-block', color: 'white', width: 150, textAlign: 'center', cursor: 'pointer'}}
                onClick={this.goToPlaylist}>
                <img src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png" style={playlistImgStyle}></img>
                <div>{this.props.name}</div>
            </div>
        )
    }
}

export default ProfilePlaylistLink