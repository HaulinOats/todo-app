import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";

const prisma = new PrismaClient();

const main = () => {
  //resets the database (https://github.com/prisma/prisma/issues/742#issuecomment-789603781)
  //need to know if this is acceptable to run during integration testing
  exec("npx prisma migrate reset", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

main();
