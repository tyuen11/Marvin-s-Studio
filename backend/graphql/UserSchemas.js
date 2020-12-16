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
const { GraphQLBoolean } = require('graphql');
var sotdType = require('./CommunitySchemas').getType('SOTD')
var communityType = require('./CommunitySchemas').getType('Community')

/*
--- PLAYLIST TYPES ---
*/
var songInputType = new GraphQLInputObjectType({
    name: 'SongInput',
    fields: function () {
        return {
            albumID: { type: GraphQLString },
            artistID: { type: GraphQLString },
            videoId: { type: GraphQLString },
            genre: { type: GraphQLString },
            title: { type: GraphQLString },
            albumName: { type: GraphQLString },
            artistName: { type: GraphQLString },
            albumArt: { type: GraphQLString },
            lastUpdated: { type: GraphQLDate }
        }
    }
})

var playlistInputType = new GraphQLInputObjectType({
    name: 'PlaylistInput',
    fields: function () {
        return {
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
    fields: function () {
        return {
            playlistId: {
                type: GraphQLString
            },
            count: {
                type: GraphQLInt
            }
        }
    }
});

var playedTypeInput = new GraphQLInputObjectType({
    name: 'PlayedInput',
    fields: function () {
        return {
            playlistId: {
                type: GraphQLString
            },
            count: {
                type: GraphQLInt
            }
        }
    }
});


var votedPlaylistsType = new GraphQLObjectType({
    name: 'VotedPlaylist',
    fields: function () {
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
    fields: function () {
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
                type: new GraphQLList(GraphQLString)
            },
            mostPlayed: {
                type: new GraphQLList(playedType)
            },
            votedPlaylists: {
                type: new GraphQLList(votedPlaylistsType)
            },
            votedSOTD: {
                type: GraphQLInt
            },
            lastUpdated: {
                type: GraphQLDate
            },
        }
    }
});

/* 
--- COMMUNITY TYPES
*/

var sotdInputType = new GraphQLInputObjectType({
    name: 'sotdInput',
    fields: function () {
        return {
            song: {
                type: songInputType
            },
            sotdVotes: {
                type: GraphQLInt
            }
        }
    }
})

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            // USER QUERIES
            users: {
                type: new GraphQLList(userType),
                resolve: function () {
                    const users = UserModel.find().exec();
                    if (!users) throw new Error("Error")
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
            userByEmail: {
                type: userType,
                args: {
                    email: {
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const userDetails = UserModel.findOne({ email: params.email }).exec()
                    if (!userDetails) throw new Error('Error')
                    return userDetails
                }
            },
            // COMMUNITY QUERIES
            communities: {
                type: GraphQLList(communityType),
                resolve: function () {
                    const community = CommunityModel.find().exec()
                    if (!community) throw new Error('Error')
                    return community
                }
            },
            community: {
                type: communityType,
                args: {
                    id: {
                        name: 'id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const communityPlaylists = CommunityModel.findById(params.id).exec()
                    if (!communityPlaylists) throw new Error('Error')
                    return communityPlaylists
                }
            },
            // PLAYLIST QUERIES
            playlists: {
                type: GraphQLList(playlistType),
                resolve: function () {
                    const playlists = PlaylistModel.find().exec();
                    if (!playlists) throw new Error("Error");
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
                resolve: function (root, params) {
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
                resolve: function (root, params) {
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
    fields: function () {
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
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    },
                    mostPlayed: {
                        type: new GraphQLNonNull(GraphQLList(playedTypeInput))
                    },
                    userPoints: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    votedPlaylists: {
                        type: new GraphQLNonNull(GraphQLList(votedPlaylistsInputType))
                    },
                    votedSOTD: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params) {
                    return UserModel.findByIdAndUpdate(params.id, {
                        collaborativePlaylists: params.collaborativePlaylists, followedPlaylists: params.followedPlaylists, ownedPlaylists: params.ownedPlaylists,
                        mostPlayed: params.mostPlayed, recentlyPlayed: params.recentlyPlayed,
                        userPoints: params.userPoints, votedPlaylists: params.votedPlaylists, votedSOTD: params.votedSOTD
                    }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            updateUserSOTDVote: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    votedSOTD: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params) {
                    return UserModel.findByIdAndUpdate(params.id, { votedSOTD: params.votedSOTD }, function (err) {
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
                    return UserModel.findByIdAndUpdate(params.id, {
                        email: params.email,
                        password: params.password, username: params.username
                    }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            updateUserPoints: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    userPoints: {
                        type: GraphQLInt
                    }

                },
                resolve(root, params) {
                    return UserModel.findByIdAndUpdate(params.id, {
                        userPoints: params.userPoints
                    }, function (err) {
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
                resolve: function (root, params) {
                    return UserModel.findByIdAndUpdate(params.id, {
                        ownedPlaylistsID: params.ownedPlaylistsID,
                        collaborativePlaylistsID: params.collaborativePlaylistsID,
                        followedPlaylistsID: params.followedPlaylistsID
                    }, function (err) {
                        if (err) {
                            console.log(err)
                            return next(err)
                        }
                    })
                }
            },
            updateVotedPlaylists: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    votedPlaylists: {

                        type: new GraphQLNonNull(GraphQLList(votedPlaylistsInputType))
                    }

                },

                resolve: function (root, params) {
                    return UserModel.findOneAndUpdate(
                        params.id, {
                        votedPlaylists: params.votedPlaylists,
                    },
                        function (err) {
                            if (err) return next(err)
                        }
                    )
                }
            },
            updateRecentlyPlayed: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    recentlyPlayed: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    }

                },

                resolve: function (root, params) {
                    return UserModel.findByIdAndUpdate(
                        params.id, {
                        recentlyPlayed: params.recentlyPlayed
                    },
                        function (err) {
                            if (err) return next(err)
                        }
                    )
                }
            },
            updateCollaborativePlaylists: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    collaborativePlaylistsID: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    }
                },

                resolve: function (root, params) {
                    return UserModel.findOneAndUpdate(
                        { email: params.email },
                        { collaborativePlaylistsID: params.collaborativePlaylistsID },
                        function (err) {
                            if (err) return next(err)


                        })
                }
            },
            updateFollowedPlaylists: {
                type: userType,
                args: {
                    id: {
                        name: "id",
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    followedPlaylistsID: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    }
                },
                resolve: function (root, params) {
                    return UserModel.findByIdAndUpdate(params.id, {
                        followedPlaylistsID: params.followedPlaylistsID
                    }, function (err) { if (err) return next(err) })
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
                resolve: function (root, params) {
                    const playlistModel = new PlaylistModel({
                        genre: "",
                        numPlays: 0,
                        numTracks: 0,
                        ownerID: params.id,
                        ownerName: params.username,
                        playlistPoints: 0,
                        privacyType: 1,
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
                resolve: function (root, params) {
                    return PlaylistModel.findByIdAndUpdate(params.id,
                        { title: params.title },
                        function (err) {
                            if (err) return next(err);
                        }
                    )
                }
            },

            updatePlaylistPoints: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    playlistPoints: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params) {
                    return PlaylistModel.findByIdAndUpdate(params.id,
                        { playlistPoints: params.playlistPoints },
                        function (err) {
                            if (err) return next(err);
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
                resolve: function (root, params) {
                    return PlaylistModel.findByIdAndUpdate(params.id,
                        { songs: params.songs },
                        function (err) {
                            if (err) return next(err);
                        }
                    )
                }
            },
            updatePlaylistPrivacy: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    privacyType: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params) {
                    return PlaylistModel.findByIdAndUpdate(params.id,
                        { privacyType: params.privacyType },
                        function (err) {
                            if (err) return next(err);
                        }
                    )
                }
            },
            updatePlaylistCollaborators: {
                type: playlistType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    collaborators: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    }
                },
                resolve: function (root, params) {
                    return PlaylistModel.findByIdAndUpdate(params.id,
                        { collaborators: params.collaborators },
                        function (err) {
                            if (err) return next(err)
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
                resolve: function (root, params) {
                    return PlaylistModel.findByIdAndUpdate(params.id, {
                        genre: params.genre,
                        numPlays: params.numPlays,
                        numTracks: params.numTracks,
                        playlistPoints: params.playlistPoints,
                        privacyType: params.privacyType,
                        songs: params.songs,
                        title: params.title
                    }, function (err) {
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
                resolve: function (root, params) {
                    const remPlaylist = PlaylistModel.findByIdAndRemove(params.id).exec();
                    if (!remPlaylist) throw new Error('Error')
                    return remPlaylist
                }
            },
            // COMMUNITY MUTATIONS
            addCommunity: {
                type: communityType,
                resolve: function () {
                    const communityModel = new CommunityModel({
                        communityPlaylistsID: [],
                        gotwPlaylist: null,
                        publicPlaylistsID: [],
                        song1: null,
                        song2: null,
                        song3: null
                    })
                    const newCommunity = communityModel.save();
                    if (!newCommunity) throw new Error('Error');
                    return newCommunity;
                }
            },
            updatePublicPlaylists: {
                type: communityType,
                args: {
                    id: {
                        name: 'id',
                        type: GraphQLString
                    },
                    publicPlaylistsID: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    }
                },
                resolve: function (root, params) {
                    return CommunityModel.findByIdAndUpdate(params.id,
                        { publicPlaylistsID: params.publicPlaylistsID },
                        function (err) {
                            if (err) return next(err)
                        }
                    )
                }
            },
            updateCommunityPlaylists: {
                type: communityType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    communityPlaylistsID: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    }
                },
                resolve: function (root, params) {
                    return CommunityModel.findByIdAndUpdate(params.id,
                        { communityPlaylistsID: params.communityPlaylistsID },
                        function (err) {
                            if (err) return next(err)
                        }
                    )
                }
            },
            updateSongs: {
                type: communityType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    song1: {
                        type: new GraphQLNonNull(sotdInputType)
                    },
                    song2: {
                        type: new GraphQLNonNull(sotdInputType)
                    },
                    song3: {
                        type: new GraphQLNonNull(sotdInputType)
                    }
                },
                resolve: function (root, params) {
                    return CommunityModel.findByIdAndUpdate(params.id,
                        { song1: params.song1, song2: params.song2, song3: params.song3 },
                        function (err) {
                            if (err) return next(err)
                        }
                    )
                }
            },
            removeCommunity: {
                type: communityType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const remCommunity = CommunityModel.findByIdAndRemove(params.id)
                    if (!remCommunity) throw new Error('Error')
                    return remCommunity
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });