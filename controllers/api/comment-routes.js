const router = require('express').Router();
const { Comment, Post } = require('../../models');

//GET =======================================================================================
router.get('/', (req,res) => {
    Comment.findAll({
        include: [
            {
                model: Post, 
                attributes: ['title', 'created_at']

            }
        ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
    
});

//POST ======================================================================================
router.post('/', (req,res) => {
    //check if a session exists
    if(req.session) {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id, //user id from the session instead of req.body
        post_id: req.body.post_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    })
}
});


//DELETE ====================================================================================
router.delete('/:id', (req,res) => {
    Comment.destroy ({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData){
            res.status(404).json({ message: 'No such comment found' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });


});



module.exports = router