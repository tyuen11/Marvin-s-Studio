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
            <div className='mr-5 text-white w-25 h-25' style={{cursor: 'pointer'}}
                onClick={this.goToPlaylist}>
                <img className='border rounded border-white w-100 h-100'
                    src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png"></img>
                <div>{this.props.name}</div>
            </div>
        )
    }
}

export default ProfilePlaylistLink