import "cross-fetch/polyfill";
// you need the following gql library when working with ApolloBoost from the browser
// import { gql } from "apollo-boost"; // this import needs cross-fetch/polyfill
import prisma from "../src/prisma";
import seedDatabase, {
  userOne,
  commentOne,
  postOne
} from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { subscribeToComments, subscribeToPosts } from "./utils/operations";

beforeEach(async () => {
  await seedDatabase();
  await jest.setTimeout(100000);
});

test("should subcsribe to comments to a post", async done => {
  const client = getClient(userOne.jwt);

  const variables = {
    postId: postOne.post.id
  };

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe("DELETED");
      done();
    }
  });

  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } });
});

// src/schema.graphql:
/*
type Subscription {
  comment(postId: ID!): CommentSubscriptionPayload!
  post: PostSubscriptionPayload!
  mypost: PostSubscriptionPayload!
}

with the type Subscription you can not create a Post b/c
it does not accept data parameter.

test("should subscribe to creation of a post", async done => {
  const client = getClient(userOne.jwt);

  client
    .subscribe({
      query: subscribeToPosts2
    })
    .subscribe({
      next(response) {
        expect(response.data.post.mutation).toBe("CREATED");
        done();
      }
    });

  await prisma.mutation.createPost({
    data: {
      title: "testing subscriptions",
      body: "",
      published: true,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
});
*/

test("should subscribe to deletion of a post", async done => {
  const client = getClient();

  client
    .subscribe({
      query: subscribeToPosts
    })
    .subscribe({
      next(response) {
        expect(response.data.post.mutation).toBe("DELETED");
        done();
      }
    });

  await prisma.mutation.deletePost({
    where: { id: postOne.post.id }
  });
});
