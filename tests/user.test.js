import "cross-fetch/polyfill";
// you need the following gql library when working with ApolloBoost from the browser
import { gql } from "apollo-boost"; // this import needs cross-fetch/polyfill
import prisma from "../src/prisma";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { createUser, getUsers, login, getProfile } from "./utils/operations";
const client = getClient();

//beforeEach(seedDatabase);

beforeEach(async () => {
  await seedDatabase();
  await jest.setTimeout(1000000);
});

test("should create a new user", async () => {
  const variables = {
    data: {
      name: "guney",
      email: "guney@example.com",
      password: "MyPass123"
    }
  };

  const response = await client.mutate({
    mutation: createUser,
    variables
  });

  //console.log(JSON.stringify(response, undefined, 4));

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  });
  expect(exists).toBe(true);

  // prisma.exists returns a promise so requires await in front of expect
  // and async up top before the function declaration. (i.e. async () => )
  // await expect(
  //  prisma.exists.User({ id: response.data.createUser.user.id })
  //).resolves.toBe(true);
});

test("should expose public author profiles", async () => {
  const response = await client.query({ query: getUsers });
  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe("Jen");
});

test("should not login with bad credentials", async () => {
  const variables = {
    data: {
      email: "jen@example.com",
      password: "red098!@#"
    }
  };

  // In the video Andrew Mead used the no-parameter version .toThrow()
  // but it did not work for me. I found the parametered one from
  // jest expect page.
  // await expect(client.mutate({ mutation: login })).rejects.toThrow();
  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow(
    "Unable to login"
  );
});

test("should not signup user with invalid password", async () => {
  const variables = {
    data: {
      name: "Ben",
      email: "ben@example.com",
      password: "pass"
    }
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow("Password must be 8 characters or longer.");
});

test("should fetch user profile", async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: getProfile });
  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
