const express = require('express');

const Posts = require('./data/db.js');
const router = express.Router();

// /api/posts
router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'error retrieving the posts'
            })
        })
})
router.post('/', (req, res) => {
    Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'error adding the hub'
            });
        });
});

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Posts.findPostComments(id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'error retrieving the posts'
            })
        })
})

router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const message = {...req.body, post_id: id}
    Posts.insertComment(message)
        .then(messages => {
            res.status(201).json(messages);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                errorMessage: 'error adding the hub'
            });
        });
});





module.exports = router;