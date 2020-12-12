import React from 'react'
import { Link } from 'react-router-dom';

class PlaylistLink extends React.Component {
    constructor(props) {
        super(props);
        console.log("Playlist link sidebar")
    }
    render() {
        return (
            <Link to='/app/playlist' {...this.props}>
                <div className='text-white text-left pl-3 mb-1' style={{cursor: 'pointer'}}>
                    {this.props.name}
                </div>
            </Link>
        )
    }
}

export default PlaylistLink