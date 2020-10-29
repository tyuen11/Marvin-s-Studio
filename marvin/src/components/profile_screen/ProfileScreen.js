import React from 'react'
import Player from '../Player';
import Sidebar from '../sidebar/Sidebar';
import ProfilePlaylistLinks from './ProfilePlaylistLinks';

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("ProfileScreen");
    }

    
    render () {
        const screenStyle = {
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'fixed',
        }

        const profileScreenStyle = {
            width: 'calc(100% - 200px)',
            background: '#232323',
            padding: '20px 40px'
        }

        const headerStyle = {
            color: 'white',
            fontSize: 50
        }

        const colHeaderStyle = {
            color: 'white',
            fontSize: 20,
            marginTop: 30,
            marginBottom: 20,
            paddingBottom: 20,
            width: '100%',
            borderBottomStyle: 'solid',
            borderColor: 'white'
        }
        return (
            <div className='Screen' style={screenStyle}>
                <Sidebar/>
                <Player/>
                <div className='ProfileScreen' style={profileScreenStyle}>
                    <h3 style={headerStyle}>
                        <img src="https://thumbs.dreamstime.com/z/business-man-profile-brazilian-white-background-38563179.jpg"
                            height='80' width='80' style={{marginRight: 20, borderRadius: '50%'}}></img>
                        John Doe
                    </h3>
                    <div className='Playlists' style={colHeaderStyle}>My Playlists</div>
                    <ProfilePlaylistLinks {...this.props}/>
                </div>
            </div>
        )
    }
}

export default ProfileScreen