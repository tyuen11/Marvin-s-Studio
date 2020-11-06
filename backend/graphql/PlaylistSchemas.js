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
            _id: {
                type: GraphQLString
            },
            albumID: {
                type: GraphQLString
            },
            artistID: {
                type: GraphQLString
            },
            genre: {
                type: GraphQLString
            },
            title: {
                type: GraphQLString
            }
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
            dateCreated: {
                type: GraphQLDate
            },
            genre: {
                type: GraphQLString
            },
            lastUpdated: {
                type: GraphQLDate
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

var queryType = new GraphQLObjectType({
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

var songInputType = new GraphQLInputObjectType({
    name: "SongInput",
    fields: {
        albumID: {type: GraphQLString},
        artistID: {type:GraphQLString},
        genre: {type: GraphQLString},
        title: {type: GraphQLString}
    }
})

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function() {
        return {
            addPlaylist: {
                type: playlistType,
                args: {
                    ownerID: {
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
            /*
            editPlaylist: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastUpdated: {
                        type: new GraphQLNonNull(GraphQLDate)
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
                        type: new GraphQLNonNull(new GraphQLList(songInputType)),
                        args: {
                            id: new GraphQLNonNull(GraphQLString),
                            albumID: new GraphQLNonNull(GraphQLString),
                            artistID: new GraphQLNonNull(GraphQLString),
                            genre: new GraphQLNonNull(GraphQLString),
                            title: new GraphQLNonNull(GraphQLString)
                        }
                    },
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    resolve(root, params) {
                        return PlaylistModel.findByIdAndUpdate( params.id, { genre: params.genre, lastUpdated: new Date(),
                                                                numTracks: params.numTracks, privacyType: params.privacyType, 
                                                                songs: params.songs, title: params.title },
                                                                function(err) {
                            if (err) return next(err);
                        }).exec();
                    }
                }
            },
            */
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

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation })