import "cross-fetch/polyfill";
// you need the following gql library when working with ApolloBoost from the browser
// import { gql } from "apollo-boost"; // this import needs cross-fetch/polyfill
import prisma from "../src/prisma";
import seedDatabase, {
  userOne,
  commentOne,
  commentTwo
} from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { deleteComment } from "./utils/operations";

//beforeEach(seedDatabase);

beforeEach(async () => {
  await seedDatabase();
  await jest.setTimeout(1000000);
});

test("should delete user's own comments", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentTwo.comment.id
  };

  await client.mutate({ mutation: deleteComment, variables });
  const exists = await prisma.exists.Comment({
    id: commentTwo.comment.id
  });
  expect(exists).toBe(false);
});

test("should not delete other users comments ", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentOne.comment.id
  };

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();
});
