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
        twats: {
          create: {
            content: faker.lorem.paragraph(),
          },
        },
        following: {
          connect: {
            id: "clid78nwn0000sc14k8acs7j9",
          },
        },
      },
    })
  );
}

(async () => {
  await prisma.$transaction(queries);
})();
