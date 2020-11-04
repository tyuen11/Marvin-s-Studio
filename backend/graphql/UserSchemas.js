var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLObjectType = require('graphql').GraphQLObjectType;

var UserModel = require('../models/User');

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
                    const userDetails = UserModel.findOne({email:params.email}).exec()
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