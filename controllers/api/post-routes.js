const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');



// get all users ========================================================================================
router.get('/', (req, res) => {
    Post.findAll({
    //   attributes: ['id', 'post_url', 'title', 'created_at'],
    attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username']
        },

        {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'] 
        },
      ]
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


  //get posts from 1 user ========================================================================================

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        // attributes: ['id', 'post_url', 'title', 'created_at'],
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
        include: [
            {
                model: User,
                attributes: ['username']
            },

            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'] 
            },
        ]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({message: "No post found with this id"});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})



//route to create a post ========================================================================================
router.post('/', (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
      title: req.body.title ,
      post_url: req.body.post_url,
      user_id: req.body.user_id
  })
  .then(dbPostData => {
      res.json(dbPostData)
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  })
});




//PUT / api/posts/upvote ========================================================================================
// router.put('/upvote', (req, res) => {
//     Vote.create({
//         user_id: req.body.user_id,
//         post_id: req.body.post_id
//     })
//     .then(() => {
//         //then find the post we jsut voted on
//         return Post.findOne({
//             where: {
//                 id: req.body.post_id
//             },
//             attributes: [
//                 'id',
//                 'post_url',
//                 'title',
//                 'created_at',
//                 // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
//                 [
//                     sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
//                     'vote_count'
//                 ]
//             ]
//         })
//     })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => res.json(err));

// });

router.put('/upvote', (req, res) => {

  //make sure a session exists
  if(req.session){
    
    //pass session id alomg with all destructured properties on req.body

    Post.upvote( {...req.body, user_id: req.session.user_id}, { Vote, Comment, User } )
      .then(updatedPostData => res.json(updatedPostData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
    }
  });


//put / update route ========================================================================================
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }

    )
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})


//defining delete route ========================================================================================
router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
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