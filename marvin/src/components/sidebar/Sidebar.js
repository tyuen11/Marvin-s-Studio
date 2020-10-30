import React from 'react'
import logo from '../../icons/marvins.png';
import PlaylistLinks from './PlaylistLinks.js'

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        console.log("Sidebar")
    }

    render() {
        const sidebarStyle = {
            width: 200,
            height: '100%',
            padding: 0,
            margin: 0,
            background: '#232323',
            textAlign: 'center',
            color: 'white',
            borderRightStyle: 'solid',
            borderThickness: 1,
            borderColor: 'white'
        }

        const searchStyle = {
            width: '80%',
            padding: 3,
            margin: 5,
            borderRadius: 5,
            borderThickness: 1,
            borderStyle: 'solid',
            borderColor: '#3d8af7',
            outline: 'none'
        }

        const buttonDivStyle = {
            backgroundColor:'#3d8af7',
            marginTop: 5,
            marginBottom: 5,
            paddingTop: 5,
            textAlign: 'center',
            width: '100%',
            display: 'block'
        }

        const buttonStyle = {
            borderStyle: 'none',
            width: '80%',
            backgroundColor: 'transparent',
            fontSize: 16,
            marginBottom: 8,
            color: 'white'
        }

        const labelStyle = {
            fontSize: 24,
            color: '#3d8af7',
            marginBottom: 10
        }

        return (
            <ul className="Sidebar" style={sidebarStyle}>
                <img src={logo} height={60} alt=''></img>
                <input type='text' style={searchStyle} placeholder='Search'></input>
                <div style={buttonDivStyle}>
                    <button style={buttonStyle}>Home</button>
                    <button style={buttonStyle}>Your Library</button>
                    <button style={buttonStyle}>Create Playlist</button>
                </div>
                <div style={labelStyle}>My Playlists</div>
                <PlaylistLinks {...this.props}/>
            </ul>
        )
        
    }
} 

export default Sidebar