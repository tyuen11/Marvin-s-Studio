var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;
var GraphQLDate = require('graphql-date')


var UserModel = require('../models/User');
var PlaylistModel = require('../models/Playlist')
var playlistType = require('./PlaylistSchemas').getType('Playlist')
//var playlistInputType = require('./PlaylistSchemas').getType('PlaylistInput')
var songInputType = require('./PlaylistSchemas').getType('SongInput')

var playlistInputType = new GraphQLInputObjectType({
    name: 'PlaylistInput',
    fields: function() {
        return{
            _id: {
                type: GraphQLString
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

var playedType = new GraphQLObjectType({
    name: 'Played',
    fields: function() {
        return {
            playlistId: {
                type: GraphQLString
            },
            type: {
                type: GraphQLString
            }
        }
    }
});

var playedTypeInput = new GraphQLInputObjectType({
    name: 'PlayedInput',
    fields: function() {
        return {
            playlistId: {
                type: GraphQLString
            },
            type: {
                type: GraphQLString
            }
        }
    }
});


var votedPlaylistsType = new GraphQLObjectType({
    name: 'VotedPlaylist',
    fields: function() {
        return {
            playlistID: {
                type: GraphQLString
            },
            votes: {
                type: GraphQLInt
            }
        }
    }
});

var votedPlaylistsInputType = new GraphQLInputObjectType({
    name: 'VotedPlaylistInput',
    fields: function() {
        return {
            playlistID: {
                type: GraphQLString
            },
            votes: {
                type: GraphQLInt
            }
        }
    }
});

var userType = new GraphQLObjectType({
    name: 'User',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            email: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString
            },
            username: {
                type: GraphQLString
            },
            userPoints: {
                type: GraphQLInt
            },
            collaborativePlaylists: {
                type: new GraphQLList(playlistType)
            },
            ownedPlaylists: {
                type: new GraphQLList(playlistType)
            },
            followedPlaylists: {
                type: new GraphQLList(playlistType)
            },
            recentlyPlayed: {
                type: new GraphQLList(playedType)
            },
            mostPlayed: {
                type: new GraphQLList(playedType)
            },
            votedPlaylists: {
                type: new GraphQLList(votedPlaylistsType)
            },
            lastUpdated: {
                type: GraphQLDate
            },
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            users: {
                type: new GraphQLList(userType),
                resolve: function() {
                    const users = UserModel.find().exec();
                    if(!users) throw new Error("Error")
                    return users
                }
            },
            user: {
                type: userType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const userDetails = UserModel.findById(params.id).exec()
                    if (!userDetails) {
                        throw new Error('Error')
                    }
                    return userDetails
                }
            }
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function() {
        return {
            addUser: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    username: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const userModel = new UserModel(params);
                    const newUser = userModel.save();
                    if (!newUser) {
                        throw new Error('Error');
                    }
                    return newUser
                }
            },
            updateUser: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    collaborativePlaylists: {
                        type: new GraphQLNonNull(GraphQLList(playlistInputType))
                    },
                    followedPlaylists: {
                        type: new GraphQLNonNull(GraphQLList(playlistInputType))
                    },
                    ownedPlaylists: {
                        type: new GraphQLNonNull(GraphQLList(playlistInputType))
                    },
                    recentlyPlayed: {
                        type: new GraphQLNonNull(GraphQLList(playedTypeInput))
                    },
                    mostPlayed: {
                        type: new GraphQLNonNull(GraphQLList(playedTypeInput))
                    },
                    userPoints: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    votedPlaylists: {
                        type: new GraphQLNonNull(GraphQLList(votedPlaylistsInputType))
                    }
                },
                resolve(root, params) {
                    return UserModel.findByIdAndUpdate( params.id, { 
                    collaborativePlaylists: params.collaborativePlaylists, followedPlaylists: params.followedPlaylists,  ownedPlaylists: params.ownedPlaylists, 
                    mostPlayed: params.mostPlayed, recentlyPlayed: params.recentlyPlayed,  
                    userPoints: params.userPoints, votedPlaylists: params.votedPlaylists }, function(err) {
                        if (err) return next(err);
                    });
                }
            },
            updateCredentials: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: GraphQLString
                    },
                    password: {
                        type: GraphQLString
                    },
                    username: {
                        type: GraphQLString
                    }
                },
                resolve(root, params) {
                    return UserModel.findByIdAndUpdate( params.id, { email: params.email, 
                        password: params.password, username: params.username }, function(err) {
                        if (err) return next(err);
                    });
                }
            },
            updatePlaylist: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    collaborativePlaylists: {
                        type: new GraphQLNonNull(GraphQLList(playlistInputType))
                    },
                    ownedPlaylists: {
                        type: new GraphQLNonNull(GraphQLList(playlistInputType))
                    }
                },
                resolve(root, params) {
                    return UserModel.findByIdAndUpdate( params.id, { 
                    ownedPlaylists: params.ownedPlaylists, collaborativePlaylists: params.collaborativePlaylists
                    }, function(err) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }
                    });
                }
            },
            removeUser: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remUser = UserModel.findByIdAndRemove(params.id).exec();
                    if (!remUser) {
                        throw new Error('Error')
                    }
                    return remUser;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });