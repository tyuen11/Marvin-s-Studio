var GraphQLSchema = require('graphql').GraphQLSchema
var GraphQLString = require('graphql').GraphQLString
var GraphQLNonNull = require('graphql').GraphQLNonNull
var GraphQLObjectType = require('graphql').GraphQLObjectType
var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType
var GraphQLInt = require('graphql').GraphQLInt
var GraphQLList = require('graphql').GraphQLList
var GraphQLDate = require('graphql-date')

var PlaylistModel = require('../models/Playlist')


var songType = new GraphQLObjectType({
    name: 'Song',
    fields: function() {
        return {
            albumID: {
                type: GraphQLString
            },
            artistID: {
                type: GraphQLString
            },
            videoId: {
                type: GraphQLString
            },
            genre: {
                type: GraphQLString
            },
            artistName: {
                type: GraphQLString
            },
            albumName: {
                type: GraphQLString
            },
            title: {
                type: GraphQLString
            },
            albumArt: {
                type: GraphQLString
            },
            lastUpdated: {
                type: GraphQLDate
            }
        }
    }
})

var songInputType = new GraphQLInputObjectType({
    name: 'SongInput',
    fields: function() {
        return { 
            albumID: { type: GraphQLString },
            artistID: { type: GraphQLString },
            videoId: { type: GraphQLString },
            genre: { type: GraphQLString },
            title: { type: GraphQLString },
            albumName: { type: GraphQLString },
            artistName: { type: GraphQLString },
            albumArt: {type: GraphQLString}
        }
    }
})

var playlistType = new GraphQLObjectType({
    name: 'Playlist',
    fields: function() {
        return {
            _id: {
                type: GraphQLString
            },
            collaborators: {
                type: new GraphQLList(GraphQLString)
            },
            genre: {
                type: GraphQLString
            },
            numPlays: {
                type: GraphQLInt
            },
            numTracks: {
                type: GraphQLInt
            },
            ownerID: {
                type: GraphQLString
            },
            ownerName: {
                type: GraphQLString
            },
            playlistPoints: {
                type: GraphQLInt
            },
            privacyType: {
                type: GraphQLInt
            },
            songs: {
                type: new GraphQLList(songType)
            },
            title: {
                type: GraphQLString
            }
        }
    }
})

var playlistInputType = new GraphQLInputObjectType({
    name: 'PlaylistInput',
    fields: function() {
        return{ 
            collaborators: {
                type: new GraphQLList(GraphQLString)
            },
            genre: {
                type: GraphQLString
            },
            numPlays: {
                type: GraphQLInt
            },
            numTracks: {
                type: GraphQLInt
            },
            ownerID: {
                type: GraphQLString
            },
            ownerName: {
                type: GraphQLString
            },
            playlistPoints: {
                type: GraphQLInt
            },
            privacyType: {
                type: GraphQLInt
            },
            songs: {
                type: new GraphQLList(songInputType)
            },
            title: {
                type: GraphQLString
            }
        }
    }
})




var query = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            playlists: {
                type: new GraphQLList(playlistType),
                resolve: function() {
                    const playlists = PlaylistModel.find().exec()
                    if (!playlists) throw new Error("Error")
                    return playlists
                }
            },
            playlist: {
                type: playlistType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    },
                    title: {
                        name: 'title',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params) {
                    const playlistDetails = PlaylistModel.findById(params.id).exec()
                    if (!playlistDetails) throw new Error('Error')
                    return playlistDetails
                }
            }
        }
    }
})

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function() {
        return {
            addPlaylist: {
                type: playlistType,
                args: {
                    ownerName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const playlistModel = new PlaylistModel(params);
                    const newPlaylist = playlistModel.save();
                    if (!newPlaylist) throw new Error("Error");
                    return newPlaylist;
                }
            },
            
            editPlaylist: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    genre: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    numTracks: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    privacyType: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    songs: {
                        type: new GraphQLNonNull(GraphQLList(songInputType))
                    },
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                },
                resolve(root, params) {
                    return PlaylistModel.findByIdAndUpdate( params.id, { genre: params.genre, numTracks: params.numTracks, 
                    privacyType: params.privacyType, songs: params.songs, title: params.title }, function(err) {
                        if (err) return next(err);
                    });
                }
                
            },
            
            removePlaylist: {
                type: playlistType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function(root, params) {
                    const remPL = PlaylistModel.findByIdAndRemove(params.id).exec();
                    if(!remPL) throw new Error('Error');
                    return remPL;
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: query, mutation: mutation })