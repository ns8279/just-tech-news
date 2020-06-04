const router = require('express').Router();
const { User, Post, Vote } = require('../../models');
//const sequelize = require('../../config/connection');

//GET /api/users ============================================================================
router.get('/', (req,res)=>{
    //Access our User model and run findALL()
    User.findAll({
        attributes: { exclude: ['password'] }, //protects the password
        include: [
            {
                model: Post,
                attributes: ['id', 'post_url', 'title', 'created_at']
            }
        ]
    }) //SQL = SELECT * from User
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/users/1 ==========================================================================
router.get('/:id', (req,res)=>{
    User.findOne({
        attributes: { exclude: ['password'] },
        
        where: {
            id: req.params.id
        },

        include: [
            {
                model: Post,
                attributes: ['id', 'post_url', 'title', 'created_at']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
        
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: 'No user found' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

//POST /api/users/ ==========================================================================
router.post('/', (req,res)=>{
    //expects {username, email and password}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

//Login route
router.post('/login', (req,res) => {
    User.findOne({ //expects email and password
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(400).json({ message: 'User not found' });
            return
        }
        //res.json({ user: dbUserData });

        //Verify User
        const validPassword = dbUserData.checkPassword(req.body.password); //checkPassword method is defined in the User.js file 
        if(!validPassword) {
            res.status(400).json({ message: 'Not a valid Password' });
            return
        }
        res.json({ user: dbUserData, message: 'You are logged in!' });

    });
});

//PUT /api/users/1 ==========================================================================
router.put('/:id', (req,res) => {
    //expects {username, email and password}

    //if req.body has exact key value pair to match the model, you can just req.body instead 
    User.update(req.body, {
        individualHooks: true, // Add this after you add beforeUpdate lifecycle event in the User creation
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]) {
            req.json(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

//DELETE /api/users/1 ==========================================================================
router.delete('/:id', (req,res)=>{
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: 'No such user found' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    
});

module.exports = router;