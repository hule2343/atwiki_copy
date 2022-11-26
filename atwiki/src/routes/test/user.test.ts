import request from "supertest";
import app from "../app";
import axios from "axios";
import exp from "constants";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany({
    where: {
      name: "user_test_data",
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: "simotuki3@email.com",
    },
  });
  await prisma.user.deleteMany({
    where: {
      name: "user_test_data_2",
    },
  });
  await prisma.user.deleteMany({
    where: {
      name: "user_test_data_3",
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      name: "user_test_data",
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: "simotuki3@email.com",
    },
  });
  await prisma.user.deleteMany({
    where: {
      name: "user_test_data_2",
    },
  });
  await prisma.user.deleteMany({
    where: {
      name: "user_test_data_3",
    },
  });
  await prisma.$disconnect();
});

jest.mock("axios");
describe("user", () => {
  test("create new user", async () => {
    const response = await request(app).post("/register").send({
      name: "user_test_data",
      password: "usertestpass",
      email: "usertest@test.com",
      phonenumber: "002-2000-2000",
      is_student: false,
    });

    expect(response.status).toBe(200);
    const testuser_id = response.body.id;
    return request(app)
      .patch("/users/" + testuser_id)
      .send({
        task: "testing_user_api",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.task).toBe("testing_user_api");
      });
  });

  test("create existing user", () => {
    return request(app)
      .post("/register")
      .send({
        name: "user_test_data",
        password: "usertestpass",
        email: "usertest@test.com",
        phonenumber: "002-2000-2000",
        is_student: false,
      })
      .then((res) => {
        expect(res.status).toBe(409);
      });
  });

  test("create with invalid email", () => {
    return request(app)
      .post("/register")
      .send({
        name: "user_test_data_2",
        email: "kangi",
        phonenumber: "090-0000-0000",
        is_student: false,
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("update with invalid email", async () => {
    const testuser = await request(app).post("/register").send({
      name: "user_test_data_3",
      password: "usertestpass",
      email: "usertest3@test.com",
      phonenumber: "002-2000-3000",
      is_student: false,
    });
    console.log(testuser.body);
    await request(app)
      .patch("/users/" + testuser.body.id)
      .send({
        email: "kangi",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("get all users", () => {
    return request(app)
      .get("/users")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});
