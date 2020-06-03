const User = require('./User');
const Post = require('./Post');

//defining relations between the models and creating associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});


module.exports = { User, Post };