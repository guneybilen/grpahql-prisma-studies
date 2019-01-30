import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "./resolvers/index";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "thisismysupersecrettext",
  fragmentReplacements
});

export { prisma as default };

/* prisma.query.users(null, "{ id  name email posts { id title } }").then(data => {
  console.log(JSON.stringify(data, undefined, 4));
}); */

// prisma.query.comments(null, "{id  text author{ id name }}").then(data => {
//   console.log(JSON.stringify(data, undefined, 4));
// });

/* prisma.mutation
  .createPost(
    {
      data: {
        title: "GraphQL 101",
        body: "",
        published: false,
        author: {
          connect: {
            id: "cjr90922p002k0865g1fq1qjz"
          }
        }
      }
    },
    "{id title body published}"
  )
  .then(data => {
    console.log(JSON.stringify(data, undefined, 4));
    return prisma.query.users(null, "{ id  name email posts { id title } }");
  })
  .then(results => {
    console.log(JSON.stringify(results, undefined, 2));
  }); */

/* prisma.mutation
  .updatePost(
    {
      data: {
        body: "This is how to get started...",
        published: true,
        author: {
          connect: {
            id: "cjr90922p002k0865g1fq1qjz"
          }
        }
      },
      where: {
        id: "cjr9bh1rn003p0865tcm85vnk"
      }
    },
    "{id title body published}"
  )
  .then(data => {
    console.log(JSON.stringify(data, undefined, 4));
    return prisma.query.posts(null, "{id title body published}");
  })
  .then(posts => {
    console.log(JSON.stringify(posts, undefined, 2));
  }); */

/* const createPostForUser = async (authorID, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorID
          }
        }
      }
    },
    "{ id }"
  );
  const user = await prisma.query.user(
    {
      where: {
        id: authorID
      }
    },
    "{id name email posts {id title published}}"
  );

  return user;
};

createPostForUser("cjr8xh7gr00150865h7qe2fur", {
  title: "A great book to read",
  body: "The War of Art",
  published: true
}).then(user => console.log(JSON.stringify(user, undefined, 2))); */

/* 
const updatePostForUser = async (postID, data) => {
  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postID
      },
      data
    },
    "{author { id }}"
  );

  const user = await prisma.query.user(
    {
      where: {
        id: post.author.id
      }
    },
    "{id name email posts { id title published }}"
  );
  return user;
};

updatePostForUser("cjr9ghyli00440865l1xmptfo", { published: false }).then(
  user => console.log(JSON.stringify(user, undefined, 2))
); */

// prisma.exists
//   .Comment({
//     id: "abc123"
//   })
//   .then(exists => {
//     console.log(exists);
//   });

// prisma.exists
//   .Comment({ id: "cjr90obb3002v0865wqixapp8" })
//   .then(exists => console.log(exists));

/* prisma.exists
  .Comment({
    id: "cjr90obb3002v0865wqixapp8",
    text: "A comment from prisma graphql"
  })
 .then(exists => console.log(exists));
 */

/* prisma.exists
  .Comment({
    id: "cjr90obb3002v0865wqixapp8",
    text: "A comment from prisma graphql",
    author: {
      id: "cjr8xh7gr00150865h7qe2fur",
      name: "Vicrom"
    }
  })
  .then(exists => console.log(exists)); */

/* const createPostForUser = async (authorID, data) => {
  const userExists = await prisma.exists.User({ id: authorID });

  if(!userExists) {
    throw new Error("User not found");
  }

  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorID
          }
        }
      }
    },
    "{ author { id name email posts {id title published}} }"
  );

  return post.author;
};

createPostForUser("cjr90922p002k0865g1fq1qjz", {
  title: "A great book to read",
  body: "The War of Art",
  published: true
})
  .then(user => console.log(JSON.stringify(user, undefined, 2)))
  .catch(error => console.log(error));
*/

/* 
const updatePostForUser = async (postID, data) => {
  // do not forget await below for prisma. prisma returns promise.
  const postExists = await prisma.exists.Post({ id: postID });

  if (!postExists) {
    throw new Error("Post not found");
  }

  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postID
      },
      data
    },
    "{author { id name email posts {id title published} }}"
  );

  return post.author;
};

updatePostForUser("cjr9lo509004q08655tr587gm", { published: true })
  .then(user => console.log(JSON.stringify(user, undefined, 2)))
  .catch(error => console.log(error.message)); */
