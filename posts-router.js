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
    console.log(req);
    if (req.body.title && req.body.contents) {
        Posts.insert(req.body)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: 'error adding post'
                });
            });
    } else {
        res.status(400).json({ message: 'add title and contents' })
    }
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
        .then(posts => {
            if (posts && posts.length > 0) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'error retrieving the posts'
            })
        })
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Posts.findPostComments(id)
        .then(comment => {
            if (comment && comment.length > 0) {
                res.status(200).json(comment);
            } else {
                res.status(404).json({
                    message: 'post doesnt exist'
                })
            }
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
    const message = { ...req.body, post_id: id }
    if (req.body.text) {
        Posts.findById(id).then(post => {
            if (post && post.length > 0) {
                Posts.insertComment(message)
                    .then(messages => {
                        res.status(201).json(messages);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            errorMessage: 'error adding comment'
                        });
                    })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        }
        ).catch(err => {
            console.log(err);
            res.status(500).json({
                errorMessage: 'error finding post'
            })
        })
    } else {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
});

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'deleted' });
            } else {
                res.status(404).json({ message: 'could not be found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error removing the hub',
            });
        });
});

router.put('/:id', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ error: "Provide title and contents" })
    } else {
        const changes = req.body;
        Posts.update(req.params.id, changes)
            .then(update => {
                if (update) {
                    res.status(200).json(update);
                } else {
                    res
                        .status(404)
                        .json({
                            error: "The post with the specified ID does not exist."
                        });
                }
            })
            .catch(error => {
                console.log("This is error in server.put(/api/posts/:id): ", error);
                res.status(500).json({ error: "Error updating the post" });
            });
    };
});








module.exports = router;