import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import ProfilePlaylistLink from '../profile_screen/ProfilePlaylistLink'
import ProfilePlaylistLinks from '../profile_screen/ProfilePlaylistLinks'
import SOTD from './sotd'

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
    render () {
        let community;
        let commPlaylists, pubPlaylists;
        let sotd1, sotd2, sotd3, genre;
        console.log(this.props.user);
        return (
            <Query pollInterval={500} query={GET_COMMUNITY} variables={{ id: "5fc69c8b61fdeb5194781f2f"}}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...'
                    if (error) return `Error! ${error.message}`
                    else {
                        console.log(data.community);
                        community = data.community

                        commPlaylists = data.community.communityPlaylistsID.slice(0, 4)
                        pubPlaylists = data.community.publicPlaylistsID.slice(0,4)
                        sotd1 = data.community.song1;
                        sotd2 = data.community.song2;
                        sotd3 = data.community.song3;
                        genre = data.community.gotwPlaylist.genre

                    }
                    return(
                        <div className='container h-100'>
                            <div className='row justify-content-center'>
                                <div id='gotw' className='col-10 mt-5'>
                                    <img className='w-100 img-responsive' style={{height: 200, objectFit: 'cover'}} 
                                        src="https://www.wmhbradio.org/wp-content/uploads/2016/07/music-placeholder.png"/>
                                    <span className='h4 position-absolute text-black' style={{top: 5, left: 20}}>Genre of the week</span>
                                    <span className='display-3 w-100 font-weight-bold text-black text-center position-absolute' style={{top: 50, left:10}}>{genre}</span>
                                </div>
                            </div>
                            <div className='row mt-4 px-5 mx-2'>
                                <div className="col-4"><SOTD user={this.props.user} community={community} song={sotd1.song} handleSongChange={this.props.handleSongChange} playing={this.props.playing}/></div>
                                <div className="col-4"><SOTD user={this.props.user} community={community} song={sotd2.song} handleSongChange={this.props.handleSongChange} playing={this.props.playing}/></div>
                                <div className="col-4"><SOTD user={this.props.user} community={community} song={sotd3.song} handleSongChange={this.props.handleSongChange} playing={this.props.playing}/></div>
                            </div>
                        <div className='row mt-5'>
                            <div className='h4 ml-3 text-white'>Community Curated</div>
                            <Link to={{
                                pathname:'/app/community',
                                state: {
                                    viewComm: true
                                }
                                }} 
                                className='h5 ml-auto text-white'>See More</Link>
                        </div>
                        <div className='divider'></div>
                        <ProfilePlaylistLinks playlists={commPlaylists}/>
                        <div className='row h4 ml-3 text-white pt-3'>Public</div>
                        <div className='divider'></div>
                        <ProfilePlaylistLinks playlists={pubPlaylists}/>
                        <div className='row h4 ml-3 text-white pt-3'>Most Played</div>
                        <div className='divider' ></div>
                    </div>
                    )
                }}
            </Query>
        )
    }
}

export default HomeScreen