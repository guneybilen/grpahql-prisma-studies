/* import { getFirstName, isValidPassword } from "../src/utils/user";

test("should return first name when given full name", () => {
  const firstName = getFirstName("Guney Bilen");

  expect(firstName).toBe("Guney");
});

test("should return first name when given first name", () => {
  const firstName = getFirstName("Jen");

  expect(firstName).toBe("Jen");
});

test("should reject passwords shorter than 8 characters", () => {
  const isValid = isValidPassword("123");

  expect(isValid).toBe(false);
});

test("should reject passwords that contains the word 'password'", () => {
  const isValid = isValidPassword("123passWOrd123");

  expect(isValid).toBe(false);
});

test("should correctly validate a valid password '", () => {
  const isValid = isValidPassword("@WERTY1234aswo");

  expect(isValid).toBe(true);
})
 */

import "cross-fetch/polyfill";
// you need the following gql library when working with ApolloBoost from the browser
import { gql } from "apollo-boost"; // this import needs cross-fetch/polyfill
import prisma from "../src/prisma";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test("should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "guney"
          email: "guney@example.com"
          password: "MyPass123"
        }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: createUser
  });

  //console.log(JSON.stringify(response, undefined, 4));

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  });
  expect(exists).toBe(true);

  // prisma.exists return a promise requires await in front of expect
  // and async up top before function. (i.e. async () => )
  // await expect(
  //  prisma.exists.User({ id: response.data.createUser.user.id })
  //).resolves.toBe(true);
});

test("should expose public author profiles", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;
  const response = await client.query({ query: getUsers });
  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe("Jen");
});

test("should not login with bad credentials", async () => {
  const login = gql`
    mutation {
      login(data: { email: "jen@example.com", password: "12345678" }) {
        token
      }
    }
  `;

  // In the video Andrew Mead used the no-parameter version .toThrow()
  // but it did not work for me. I found the parametered one from
  // jest expect page.
  //await expect(client.mutate({ mutation: login })).rejects.toThrow();
  await expect(client.mutate({ mutation: login })).rejects.toThrow(
    "Unable to login"
  );
});

test("should not signup user with invalid password", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Ben", email: "ben@example.com", password: "red" }
      ) {
        token
      }
    }
  `;

  //"does not matter what I should grab, lets pick token"

  await expect(client.mutate({ mutation: createUser })).rejects.toThrow(
    "Password must be 8 characters or longer."
  );
});

test("should fetch user profile", async () => {
  const client = getClient(userOne.jwt);
  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `;
  const { data } = await client.query({ query: getProfile });
  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
