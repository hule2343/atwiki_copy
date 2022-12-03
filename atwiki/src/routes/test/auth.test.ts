import request from "supertest";
import app from "../app";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { expression } from "joi";
import { response } from "express";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany({
    where: {
      name: "auth_test_data",
    },
  });
  await prisma.user.deleteMany({
    where: {
      name: "Non_test_user",
    },
  });
});

afterAll(async () => [
  await prisma.user.deleteMany({
    where: {
      name: "auth_test_data",
    },
  }),
]);

jest.mock("axios");

describe("auth", () => {
  test("check login API after register new user", async () => {
    const response = await request(app).post("/register").send({
      name: "auth_test_data",
      password: "authtestpass",
      email: "authtest@test.com",
      phonenumber: "002-2333-2000",
      is_student: false,
    });

    expect(response.status).toBe(200);

    return request(app)
      .post("/login")
      .send({
        username: "auth_test_data",
        password: "authtestpass",
      })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  test("reject wrong password", async () => {
    return request(app)
      .post("/login")
      .send({
        name: "auth_test_data",
        password: "wrongtestpass",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
  test("reject unexisting name", () => {
    return request(app)
      .post("/login")
      .send({
        name: "Non_test_user",
        password: "authtestpass",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
});
