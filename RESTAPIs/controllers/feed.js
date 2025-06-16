exports.getPosts = (req,res,next) => {
    res.status(200).json({
        posts: [{title: 'First Post', content : 'This is my first post'}]
    });
};

exports.createPosts = (req, res, next) => {
  const title = req.body?.title || 'Untitled';
  const content = req.body?.content || 'No content';

  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toISOString(), title:title , content: content }
  });
};
