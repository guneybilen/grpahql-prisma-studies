import "cross-fetch/polyfill";
// you need the following gql library when working with ApolloBoost from the browser
import { gql } from "apollo-boost"; // this import needs cross-fetch/polyfill
import prisma from "../src/prisma";
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test("should expose published public posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        body
        published
        author {
          name
          email
        }
      }
    }
  `;
  const response = await client.query({ query: getPosts });
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
  expect(response.data.posts[0].author.email).toBe(null);
  expect(response.data.posts[0].author.name).toBe("Jen");
});

test("should fetch user's posts", async () => {
  const client = getClient(userOne.jwt);
  const myPosts = gql`
    query {
      myposts {
        id
        title
        body
        published
      }
    }
  `;
  const { data } = await client.query({ query: myPosts });
  expect(data.myposts.length).toBe(2);
});

test("should be able to update own post", async () => {
  const client = getClient(userOne.jwt);
  const updatePost = gql`
    mutation{
      updatePost(
        id: "${postOne.post.id}",
        data: {
          published: false
          }
        )
        {
          id 
          title 
          body 
          published
        }
    }
  `;

  const { data } = await client.mutate({ mutation: updatePost });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  });
  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("should be able to create post", async () => {
  const client = getClient(userOne.jwt);
  const createPost = gql`
    mutation {
      createPost(data: { title: "A test post", body: "", published: true }) {
        id
        title
        body
        published
      }
    }
  `;

  const { data } = await client.mutate({ mutation: createPost });

  expect(data.createPost.title).toBe("A test post");
  expect(data.createPost.body).toBe("");
  expect(data.createPost.published).toBe(true);
});

test("should  delete post", async () => {
  const client = getClient(userOne.jwt);
  const deletePost = gql`
    mutation{
      deletePost(
        id: "${postTwo.post.id}"
      ) {
        id
      }
    }
  `;

  await client.mutate({ mutation: deletePost });
  const exists = await prisma.exists.Post({
    id: postTwo.post.id
  });
  expect(exists).toBe(false);
});
