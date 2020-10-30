import React from 'react'
import logo from '../../icons/marvins.png';
import PlaylistLinks from './PlaylistLinks.js'

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sidebar")
    }

    render() {
        return (
            <div className="p-0 h-100 text-center border border-white border-left-0 border-top-0 border-bottom-0" style={{width: 200}}>
                <img src={logo} height='60' width='60' alt=''></img>
                <input className='border border-primary px-1 py-1 my-1 rounded w-75' type='text' placeholder='Search'></input>
                <div className='my-1 pt-1 text-center w-100 display-block' style={{background:'#3d8af7', height: 115}}>
                    <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0'>Home</button>
                    <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0'>Your Library</button>
                    <button className='btn btn-outline-primary mb-1 w-75 py-1 bg-transparent text-white border-0'>Create Playlist</button>
                </div>
                <div className='h4 text-primary'>My Playlists</div>
                <PlaylistLinks {...this.props.profile}/>
            </div>
        )
        
    }
} 

export default Sidebar