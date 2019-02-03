import "cross-fetch/polyfill";
// you need the following gql library when working with ApolloBoost from the browser
import { gql } from "apollo-boost"; // this import needs cross-fetch/polyfill
import seedDatabase from "./utils/seedDatabase";
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
}); // 50000 is for timeout property for the async function
