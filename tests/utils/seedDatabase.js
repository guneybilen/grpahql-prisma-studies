import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
  input: {
    name: "Jen",
    email: "jen@example.com",
    password: bcrypt.hashSync("red098!@#$")
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: "Sarah",
    email: "sarah@example.com",
    password: bcrypt.hashSync("fed098!@#$")
  },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: "My published post",
    body: "",
    published: true
  },
  post: undefined
};

const postTwo = {
  input: {
    title: "My draft post",
    body: "",
    published: false
  },
  post: undefined
};

const commentOne = {
  input: {
    text: "Comment by Sarah"
  },
  comment: undefined
};

const commentTwo = {
  input: {
    text: "Comment by Jen"
  },
  comment: undefined
};

const seedDatabase = async () => {
  jest.setTimeout(100000); // jest.setTimeout(10000); should be in a before hook

  // delete test data
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  });

  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  // create post one
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });

  // create post two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });

  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userTwo.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  });

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  });
};

export {
  seedDatabase as default,
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo
};
