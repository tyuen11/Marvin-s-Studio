import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import * as Icon from 'react-bootstrap-icons'

const UPDATE_SOTD = gql`
    mutation updateSongs(
        $id: String!
        $song1: sotdInput!
        $song2: sotdInput!
        $song3: sotdInput!
    ) {
        updateSongs(
            id: $id
            song1: $song1
            song2: $song2
            song3: $song3
        ) {
            _id
        }
    }
`
const UPDATE_USER_POINTS = gql`
    mutation updateUserPoints(
        $id: String!
        $userPoints: Int!
    ) {
    updateUserPoints(
        id: $id
        userPoints: $userPoints
    ) {
        _id
    }
}
`

const UPDATE_USER_SOTD = gql`
    mutation updateUserSOTDVote(
        $id: String!
        $votedSOTD: Int!
    ) {
        updateUserSOTDVote(
            id: $id
            votedSOTD: $votedSOTD
        ) {
            _id
        }
    }
`

class sotd extends Component {


    handleSOTDVote = (sotds, index, user, updateSOTD, updateUserSOTD, updateUserPoints) => {
        console.log("voted!");
        let userPoints=user.userPoints
        if (user.votedSOTD - 1 === index) {
            sotds[index].sotdVotes -= 1;
            index = 0
            userPoints-=3
           //remove points
        }
        if (user.votedSOTD === 0) {
            sotds[index].sotdVotes += 1;
            index += 1;
            userPoints+=3
            //add points
        }
        sotds.forEach(sotd => {
            delete sotd['__typename'];
            delete sotd.song['__typename'];
        })

        updateUserPoints({
            variables: {
                id: user._id,
                userPoints: userPoints
            }
        })            
        updateSOTD({
            variables: {
                id: "5fc69c8b61fdeb5194781f2f",
                song1: sotds[0],
                song2: sotds[1],
                song3: sotds[2]
            }
        })
        updateUserSOTD({
            variables: {
                id: user._id,
                votedSOTD: index
            }

        })
    }
    render() {
        let community = this.props.community;
        let song = this.props.song;
        let sotds = [community.song1, community.song2, community.song3];
        let index = sotds.findIndex(sotd => sotd.song.videoId === song.videoId);
        let user = this.props.user;
        return (
            <Mutation mutation={UPDATE_USER_POINTS} >
                {(updateUserPoints, { loading, error }) => (
                    <Mutation mutation={UPDATE_USER_SOTD}>
                        {(updateUserSOTD, { loading, error }) => (
                            <Mutation mutation={UPDATE_SOTD}>
                                {(updateSOTD, { loading, error }) => (
                                    <div>
                                        <div className='pt-2 text-center d-block overflow-hidden text-nowrap text-truncate' style={{ textOverflow: 'ellipsis' }}>
                                            <a className='h5 text-playlist' onClick={this.props.handleSongChange.bind(this, song)} style={{width:"70%"}}>{song.title}</a>
                                            <div className='position-relative mb-3  '>
                                                <img className='rounded' src={song.albumArt} style={{ height: 150, width: 150 }} />
                                            </div>
                                            {user !== null ? user.votedSOTD !== 0 ? user.votedSOTD != index + 1 && user.votedSOTD != 0 ? <Icon.HandThumbsUp size={30} color="white" /> :
                                                <Icon.HandThumbsUp size={30} color="#3d8af7" onClick={this.handleSOTDVote.bind(this, sotds, index, user, updateSOTD, updateUserSOTD, updateUserPoints)} onMouseOut={() => this.setState({ hovered: true })}
                                                    onMouseOver={() => this.setState({ hovered: false })} style={{ cursor: "pointer" }} /> :
                                                <Icon.HandThumbsUp size={30} color="white" onMouseOut={() => this.setState({ hovered: true })}
                                                    onMouseOver={() => this.setState({ hovered: false })} onClick={this.handleSOTDVote.bind(this, sotds, index, user, updateSOTD, updateUserSOTD, updateUserPoints)} style={{ cursor: "pointer" }} /> : null
                                            }
                                            {/* <Icon.HandThumbsUp size={30} color="white" onClick={this.handleSOTDVote.bind(this, sotds, index, user, updateSOTD, updateUserSOTD)}/> */}
                                        </div>
                                    </div>
                                )}
                            </Mutation>
                        )}
                    </Mutation>
                )}
            </Mutation>
        )
    }
}

export default sotd;