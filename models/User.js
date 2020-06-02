const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt'); 

//create user model

class User extends Model {}

//define table and columns
User.init(
    //=========================== object DataTypes =================================================================
    {
        // TABLE COLUMN DEFINITIONS GO HERE

        //define an id column
        id:{
            //Use the special sequelize dataTypes object provide what type of data it is
            type: DataTypes.INTEGER,

            //this is the equivalent of SQL's 'NOT NULL' option
            allowNull: false,

            //instruct that this is the primary key
            primaryKey: true,

            //turn on autoincrement
            autoIncrement: true,

        },

        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },

        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,

            //cant have duplicate values of emailid in this table
            unique: true,

            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }

        },

        //define a pw column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //the length should be atleast 4
                len: [4]
            }
        }
    },

    //=============================== Object Model ================================================================
    {
        // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        //hooks for password encryption
        hooks:{
            //Setup beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;   
            },

            //set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;   
            },
        },

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,

        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,

        // don't pluralize name of database table
        freezeTableName: true,

        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,

        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;
