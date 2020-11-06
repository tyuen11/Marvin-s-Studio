import React from 'react'
import  {Route} from 'react-router'
import { Link } from 'react-router-dom';
import PlaylistScreen from '../playlist_screen/PlaylistScreen';

class PlaylistLink extends React.Component {
    constructor(props) {
        super(props);
        console.log("Playlist link sidebar")
    }
    render() {
        return (
            <div className='text-white text-center pl-3 mb-1' style={{cursor: 'pointer'}}>{this.props.name}</div>
            <Link to='/user/playlist' {...this.props}>
                <div className='text-white text-left pl-3 mb-1' style={{cursor: 'pointer'}}>
                    {this.props.name}
                </div>
            </Link>
        )
    }
}

export default PlaylistLink