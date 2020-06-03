const router = require('express').Router();
const { Post, User } = require('../../models');

//GET /api/posts ============================================================================
router.get('/', (req,res)=>{
    console.log('================================');
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']

            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

//GET /api/posts/1 ==========================================================================
router.get('/:id', (req,res)=>{
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']

            }
        ]
        
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

//POST /api/posts/ ==========================================================================
router.post('/', (req,res)=>{
    //expects {title, post_url, user_id}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

//PUT /api/posts/1 ==========================================================================
router.put('/:id', (req,res) => {
    //expects {title, post_url, user_id}

    //if req.body has exact key value pair to match the model, you can just req.body instead 
    Post.update(
        {
            title: req.body.title
        },
        {
        //individualHooks: true, // Add this after you add beforeUpdate lifecycle event in the User creation
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData) {
            req.json(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

//DELETE /api/posts/1 ==========================================================================
router.delete('/:id', (req,res)=>{
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No such post found' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    
});



module.exports = router;