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
var playlistType = require('./PlaylistSchemas').getType('Playlist')

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
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });