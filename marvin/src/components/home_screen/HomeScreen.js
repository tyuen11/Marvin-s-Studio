import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import * as Icon from 'react-bootstrap-icons'
import ProfilePlaylistLink from '../profile_screen/ProfilePlaylistLink'
import ProfilePlaylistLinks from '../profile_screen/ProfilePlaylistLinks'
import SOTD from './sotd'
import ViewedPlaylistLinks from './ViewedPlaylistLinks'


const GET_COMMUNITY = gql`
    query community($id: String!) {
        community(id: $id) {
            communityPlaylistsID
            publicPlaylistsID
            gotwPlaylist {
                _id,
                genre
            }
            song1 {
                song{
                    title
                    videoId
                    artistID
                    artistName
                    albumName
                    genre
                    albumArt
                }
                sotdVotes
            }
            song2 {
                song{
                    title
                    videoId
                    artistID
                    artistName
                    albumName
                    genre
                    albumArt
                }
                sotdVotes
            }
            song3 {
                song{
                    title
                    videoId
                    artistID
                    artistName
                    albumName
                    genre
                    albumArt
                }
                sotdVotes
            }
        }
    }
`

const GET_PLAYLIST = gql`
    query playlist($id: String!) {
        playlist(id: $id) {
            _id
            title
        }
    }
`

class HomeScreen extends React.Component {
    render() {
        let community;
        let commPlaylists, pubPlaylists;
        let sotd1, sotd2, sotd3, genre;
        let recentlyPlayed;
        return (
            <Query pollInterval={500} query={GET_COMMUNITY} variables={{ id: "5fc69c8b61fdeb5194781f2f" }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...'
                    if (error) return `Error! ${error.message}`
                    else {
                        console.log(data.community);
                        community = data.community
                        commPlaylists = data.community.communityPlaylistsID.slice(0, 4)
                        pubPlaylists = data.community.publicPlaylistsID.slice(0, 4)
                        sotd1 = data.community.song1;
                        sotd2 = data.community.song2;
                        sotd3 = data.community.song3;
                        genre = data.community.gotwPlaylist.genre
                        recentlyPlayed= this.props.user ? this.props.user.recentlyPlayed.slice(-4) : []                   
                    }
                    return (
                        <div className='container h-100'>
                            <div className='row justify-content-center'>
                                <div id='gotw' className='col-10 mt-5'>
                                    <img className='w-100 img-responsive' style={{ height: 230, objectFit: 'cover' }}
                                        src="https://pixy.org/src/68/680088.jpg" />
                                    <span className='h4 position-absolute text-black' style={{ top: 5, left: 20 }}>Genre of the Week</span>
                                    {/* <Icon.InfoCircle data-toggle="tooltip" color="black" className='position-absolute text-black' style={{top: 5, right: 30}}> </Icon.InfoCircle> */}
                                    <span className='display-3 w-100 font-weight-bold text-center position-absolute' style={{ top: 50, left: 10, color: '#3d8af7', fontSize:70, WebkitTextStroke: '1.2px black'}}>{genre}</span>
                                </div>
                            </div>
                            <div className='row mt-4 px-5 mx-2'>
                                <div className="col-4"><SOTD user={this.props.user} community={community} song={sotd1.song} handleSongChange={this.props.handleSongChange} playing={this.props.playing} /></div>
                                <div className="col-4"><SOTD user={this.props.user} community={community} song={sotd2.song} handleSongChange={this.props.handleSongChange} playing={this.props.playing} /></div>
                                <div className="col-4"><SOTD user={this.props.user} community={community} song={sotd3.song} handleSongChange={this.props.handleSongChange} playing={this.props.playing} /></div>
                            </div>
                            <div className='row mt-5'>
                                <div className='h4 ml-3 text-white'>Community Curated</div>
                                <Link to={{
                                    pathname: '/app/community',
                                    state: {
                                        viewComm: true
                                    }
                                }}
                                    className='h5 ml-auto text-white'>See More</Link>
                            </div>
                            <div className='divider'></div>
                            <ProfilePlaylistLinks playlists={commPlaylists} />
                            <div className='row h4 ml-3 text-white mt-3'>Public</div>
                            <div className='divider'></div>
                            <ProfilePlaylistLinks playlists={pubPlaylists} />
                            {this.props.user !== null ?
                                <div>
                                    <div className='row h4 ml-3 text-white mt-4'>Recently Played</div>
                                    <div className='divider' ></div>
                                    <div className='row text-wrap w-100' style={{paddingRight:'20%', paddingLeft: 20}}>
                                        {recentlyPlayed.map((playlistID, index) => (
                                            <ViewedPlaylistLinks playlistID={playlistID} key={index} myProfile={true} />
                                        ))}
                                    </div>
                                </div>
                                : null}
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default HomeScreen