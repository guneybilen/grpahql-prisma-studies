import getUserid from "../utils/getUserid";

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      };
    }

    // (null, null) gets all scalar fields for the user.
    // id, name, email but NOT post or comments relations
    // prisma.query.users(null, null)

    // pass the info fields sent by the user.
    // all values that are after parameters set by {}
    // will be received by prisma
    return prisma.query.users(opArgs, info);
  },

  myposts(parent, args, { prisma, request }, info) {
    const userId = getUserid(request);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };

    // and if you choose provide a query
    // we will limit by the following OR.
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }

    // pass the info fields sent by the user.
    // all values that are after parameters set by {}
    // will be received by prisma.
    return prisma.query.posts(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    // to only get published posts
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        published: true
      }
    };

    // and if you choose provide a query
    // we will limit by the following OR.
    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }

    // pass the info fields sent by the user.
    // all values that are after parameters set by {}
    // will be received by prisma
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      args: args.orderBy
    };

    return prisma.query.comments(opArgs, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserid(request);

    //Following not is in video.
    // if (!userId) {
    //  throw new Error("Not Authorized");
    //} up to here.

    return prisma.query.user({
      where: {
        id: userId
      }
    });
  },
  async post(parent, args, { prisma, request }, info) {
    const userID = getUserid(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userID
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length == 0) {
      throw new Error("Post not found");
    }

    return posts[0];
  }
};

export { Query as default };
