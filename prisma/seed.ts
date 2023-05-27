import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const queries = [];
for (let i = 0; i < 50; i++) {
  queries.push(
    prisma.user.create({
      data: {
        name: faker.internet.userName(),
        image: faker.image.avatar(),
        email: faker.internet.email(),
        posts: {
          create: {
            content: faker.lorem.paragraph(),
          },
        },
        following: {
          connect: {
            id: "clhts0qg10000scw4cz9yn7dx",
          },
        },
      },
    })
  );
}

(async () => {
  await prisma.$transaction(queries);
})();
