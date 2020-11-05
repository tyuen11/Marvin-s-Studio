var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLInt = require('graphql').GraphQLInt;
const { GraphQLScalarType, GraphQLInputObjectType } = require('graphql');
var GraphQLDate = require('graphql').GraphQLDate;
const { getBlockStringIndentation } = require('graphql/language/blockString');
const { nonExecutableDefinitionMessage } = require('graphql/validation/rules/ExecutableDefinitions');
const { mongo } = require('mongoose');
var GraphQLEnumType = require('graphql').GraphQLEnumType;
var GraphQLList = require('graphql').GraphQLList

var UserModel = require('../models/User');
/*
var communityType = new GraphQLObjectType({
    name: 'Community',
    fields: function() {
       return{
            communityPlaylists: {
                type: new GraphQLList(playlistType)
            },
            gotwPlaylist: {
                type: playlistType
            },
            publicPlaylists: {
                type: new GraphQLList(playlistType)
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

*/
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
                type: GraphQLInt
            },
            genre: {
                type: GraphQLString
            },
            lastUpdated: {
                type: GraphQLInt
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

/*
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
*/
var recentlyPlayedType = new GraphQLObjectType({
    name: 'RecentlyPlayed',
    fields: function() {
        return {
            id: {
                type: GraphQLString
            },
            type: {
                type: GraphQLString
            }
        }
    }
})

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
})

var userType = new GraphQLObjectType({
    name: 'User',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            collaborativePlaylists: {
                type: new GraphQLList(playlistType)
            },
            email: {
                type: GraphQLString
            },
            followedPlaylists: {
                type: new GraphQLList(playlistType)
            },
            mostPlayed: {
                type: new GraphQLList(playlistType)
            },
            ownedPlaylists: {
                type: new GraphQLList(playlistType)
            },
            password: {
                type: GraphQLString
            },
            recentlyPlayed: {
                type: new GraphQLList(recentlyPlayedType)
            },
            username: {
                type: GraphQLString
            },
            userPoints: {
                type: GraphQLInt
            },
            votedPlaylists: {
                type: new GraphQLList(votedPlaylistsType)
            }
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            user: {
                type: userType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    },
                    email: {
                        name: 'email',
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
            },
            userVerification: {
                type: userType,
                args: {
                    email: {
                        name: 'email',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const userDetails = UserModel.findOne( {email:params.email}, ).exec()
                    if (!userDetails) {
                        throw new Error('Error')
                    }
                    return userDetails
                }
            },
            playlist: {
                type: playlistType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params) {
                    const playlistDetails = UserModel.find().findById(params.id).exec()
                    if (!playlistDetails) throw new Error('Error')
                    return playlistDetails
                }
            }
        }
    }
});

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
                    const playlistModel = new UserModel(params);
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
                        type: new GraphQLNonNull(GraphQLInt)
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
                        return UserModel.findByIdAndUpdate( params.id, { genre: params.genre, lastUpdated: params.lastUpdated,
                                                            numTracks: params.numTracks, privacyType: params.privacyType, 
                                                            songs: params.songs, title: params.title },
                                                            function(err) {
                            if (err) return next(err);
                        });
                    }
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
                    const remPL = UserModel.findByIdAndRemove(params.id).exec();
                    if(!remPL) throw new Error('Error');
                    return remPL;
                }
            }
            */
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });