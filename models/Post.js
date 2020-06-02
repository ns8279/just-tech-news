const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

//Create the Post model

class Post extends Model {};

//Create the fields and columns for our Post model

Post.init(
    //========================= Object DataType ==================================================
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },

        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },

    // ==============================Object Model ===============================================
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;