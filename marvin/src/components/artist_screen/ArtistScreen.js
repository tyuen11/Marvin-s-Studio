import React from 'react'
import Player from '../Player'
import Sidebar from '../sidebar/Sidebar'
import logo from '../icons/marvins.png'

class ArtistScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("Passed props");
    }
    render () {
        const screenStyle = {
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'fixed',
        }

        const artistScreenStyle = {
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
            paddingBottom: 20,
            width: '100%',
            borderBottomStyle: 'solid',
            borderColor: 'white'
        }
        return (
            <div className='Screen' style={screenStyle}>
                <Sidebar/>
                <Player/>
                <div className='ArtistScreen' style={artistScreenStyle}>
                    <h3 style={headerStyle}>
                        <img src={this.props.image} 
                            height='80' width='80'style={{marginRight: 20, borderRadius: '50%'}}></img>
                        {this.props.name}
                    </h3>
                    <div className='Albums' style={colHeaderStyle}>Albums</div>
                </div>

            </div>
        )
    }
}

export default ArtistScreen