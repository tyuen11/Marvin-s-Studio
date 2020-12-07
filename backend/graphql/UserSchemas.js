var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;
var GraphQLDate = require('graphql-date')

// USER MODEL
var UserModel = require('../models/User');

// PLAYLIST MODEL AND TYPES
var PlaylistModel = require('../models/Playlist')
var playlistType = require('./PlaylistSchemas').getType('Playlist')
//var songInputType = require('./PlaylistSchemas').getType('SongInput')
//var playlistInputType = require('./PlaylistSchemas').getType('PlaylistInput')

// COMMUNITY MODEL AND TYPES
var CommunityModel = require('../models/Community');
const PlaylistSchemas = require('./PlaylistSchemas');
var sotdType = require('./CommunitySchemas').getType('SOTD')
var communityType = require('./CommunitySchemas').getType('Community')

/*
--- PLAYLIST TYPES ---
*/
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
            artistName: { type: GraphQLString }
        }
    }
})

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

/*
--- USER TYPES ---
*/

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
            collaborativePlaylistsID: {
                type: new GraphQLList(GraphQLString)
            },
            ownedPlaylists: {
                type: new GraphQLList(playlistType)
            },
            ownedPlaylistsID: {
                type: new GraphQLList(GraphQLString)
            },
            followedPlaylists: {
                type: new GraphQLList(playlistType)
            },
            followedPlaylistsID: {
                type: new GraphQLList(GraphQLString)
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
            // USER QUERIES
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
            },
            // COMMUNITY QUERIES
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
            },
            // PLAYLIST QUERIES
            playlists: {
                type: GraphQLList(playlistType),
                resolve: function() {
                    const playlists = PlaylistModel.find().exec();
                    if(!playlists) throw new Error("Error");
                    return playlists
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
                    const playlist = PlaylistModel.findById(params.id).exec()
                    if (!playlist) {
                        throw new Error('Error')
                    }
                    return playlist
                }
            },
            userOwnedPlaylists: {
                type: GraphQLList(playlistType),
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params) {
                    const user = UserModel.findById(params.id).exec();
                    if (!user) throw new Error('user undef err');
                    if (user.ownedPlaylistsID == null) throw new Error('owned pl id undef err');
                    let playlists = [];
                    user.ownedPlaylistsID.forEach(pl_id => {
                        let playlistToAdd = PlaylistModel.findById(pl_id).exec();
                        playlists.push(playlistToAdd);
                    })
                    return playlists;
                }
            }
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function() {
        return {
            // USER MUTATIONS
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
            updatePlaylistIDs: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    ownedPlaylistsID: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    },
                    collaborativePlaylistsID: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    },
                    followedPlaylistsID: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    }
                },
                resolve: function(root, params) {
                    return UserModel.findByIdAndUpdate(params.id, {
                        ownedPlaylistsID: params.ownedPlaylistsID,
                        collaborativePlaylistsID: params.collaborativePlaylistsID,
                        followedPlaylistsID: params.followedPlaylistsID
                    }, function(err) {
                        if (err) {
                            console.log(err)
                            return next(err)
                        }
                    })
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
            },
            // PLAYLIST MUTATIONS
            addPlaylist: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    username: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function(root, params) {
                    const playlistModel = new PlaylistModel({
                        genre: "",
                        numPlays: 0,
                        numTracks: 0,
                        ownerID: params.id,
                        ownerName: params.username,
                        playlistPoints: 0,
                        privacyType: 0,
                        songs: [],
                        title: params.title
                    })
                    
                    const newPlaylist = playlistModel.save();
                    if (!newPlaylist) throw new Error("Error");
                    return newPlaylist;
                }
            },
            updatePlaylistName: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function(root, params) {
                    return PlaylistModel.findByIdAndUpdate( params.id,
                        { title: params.title },
                        function(err) {
                            if(err) return next(err);
                        }
                    )
                }
            },
            updatePlaylistSongs: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    songs: {
                        type: new GraphQLNonNull(GraphQLList(songInputType))
                    }
                },
                resolve: function(root, params) {
                    return PlaylistModel.findByIdAndUpdate(params.id, 
                        { songs: params.songs },
                        function(err) {
                            if(err) return next(err);
                        }
                    )
                }
            },
            updatePlaylist: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    genre: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    numPlays: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    numTracks: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    playlistPoints: {
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
                    }
                },
                resolve: function(root, params) {
                    return PlaylistModel.findByIdAndUpdate( params.id, {
                        genre: params.genre,
                        numPlays: params.numPlays,
                        numTracks: params.numTracks,
                        playlistPoints: params.playlistPoints,
                        privacyType: params.privacyType,
                        songs: params.songs,
                        title: params.title
                    }, function(err) {
                        if (err) {
                            console.log(err)
                            return next(err)
                        }
                    });
                }
            },
            removePlaylist: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function(root, params) {
                    const remPlaylist = PlaylistModel.findByIdAndRemove(params.id).exec();
                    if(!remPlaylist) throw new Error('Error')
                    return remPlaylist
                }
            },
            // COMMUNITY MUTATIONS
            
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });