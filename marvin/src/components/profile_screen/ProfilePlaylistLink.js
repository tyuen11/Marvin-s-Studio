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
       return (
            <div className='col mr-5 text-white p-0' style={{cursor: 'pointer', width: 120, height: 120}}
                onClick={this.goToPlaylist}>
                <img className='border rounded border-white w-100 h-100'
                    src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png"></img>
                <div className='text-center'>{this.props.name}</div>
            </div>
        )
    }
}

export default ProfilePlaylistLink