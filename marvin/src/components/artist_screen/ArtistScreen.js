import React from 'react'
import Player from '../Player'
import Sidebar from '../sidebar/Sidebar'
import AlbumLinks from './AlbumLinks';
import { Container, Image, Row, Col } from 'react-bootstrap'

class ArtistScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log("Passed props");
    }
    render () {
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

        const artistScreenStyle = {
            width: 'calc(100% - 200px)',
            background: '#232323',
            padding: '20px 40px'
        }

        return (
            <div className='container d-flex w-100 h-100 position-fixed p-0'>
                <Sidebar {...this.props}/>
                <Player/>
                <div className='container px-5 py-4'>
                    <div className='display-4 text-white border border-white border-left-0 border-right-0 border-top-0 mb-3'>
                        <img className='rounded-circle mr-3 mb-4' src={this.props.artist.image} height='80' width='80'></img>
                        {this.props.artist.name}
                        <div className='h4'>Albums</div>
                    </div>
                    <AlbumLinks {...this.props.artist}/>
                </div>
            </div>
        )
    }
}

export default ArtistScreen