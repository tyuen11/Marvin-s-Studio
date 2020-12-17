var GraphQLSchema = require('graphql').GraphQLSchema
var GraphQLList = require('graphql').GraphQLList
var GraphQLObjectType = require('graphql').GraphQLObjectType
var GraphQLInt = require('graphql').GraphQLInt
var GraphQLString = require('graphql').GraphQLString

var CommunityModel = require('../models/Community')
var playlistType = require('./PlaylistSchemas').getType('Playlist')
var songType = require('./PlaylistSchemas').getType('Song')

var sotdType = new GraphQLObjectType({
    name: 'SOTD',
    fields: function() {
        return {
            song: {
                type: songType
            },
            sotdVotes: {
                type: GraphQLInt
            }
        }
    }
})

var communityType = new GraphQLObjectType({
    name: 'Community',
    fields: function() {
       return{
            _id: {
               type: GraphQLString
            },
            communityPlaylists: {
                type: new GraphQLList(playlistType)
            },
            communityPlaylistsID: {
                type: new GraphQLList(GraphQLString)
            },
            gotwPlaylist: {
                type: playlistType
            },
            publicPlaylists: {
                type: new GraphQLList(playlistType)
            },
            publicPlaylistsID: {
                type: new GraphQLList(GraphQLString)
            },
            song1: {
                type: sotdType
            },
            song2: {
                type: sotdType
            },
            song3: {
                type: sotdType
            }
        }

    }
})

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            community: {
                type: communityType,
                resolve: function() {
                    const community = CommunityModel.find().exec()
                    if(!community) throw new Error('Error')
                    return community
                }
            },
            communityPlaylists: {
                type: new GraphQLList(playlistType),
                resolve: function() {
                    const communityPlaylists = CommunityModel.find().exec()
                    if (!communityPlaylists) throw new Error('Error')
                    return communityPlaylists
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: queryType })

