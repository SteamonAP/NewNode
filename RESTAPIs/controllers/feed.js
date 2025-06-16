const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is my first post",
        imageUrl: "images/amogh.jpg",
        creator: {
          name: "Amogh",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPosts = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({
      message: 'Validation error',
      errors: errors.array()
    });
  };
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: 'Amogh',
        createdAt: new Date()
      },
    },
  });
};
