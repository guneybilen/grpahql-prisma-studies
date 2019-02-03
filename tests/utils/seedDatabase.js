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

const seedDatabase = async () => {
  jest.setTimeout(10000); // jest.setTimeout(10000); should be in a before hook

  // delete test data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

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
};

export { seedDatabase as default, userOne, postOne, postTwo };
