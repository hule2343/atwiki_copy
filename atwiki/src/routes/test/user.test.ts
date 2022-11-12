import request from "supertest";
import app from "../app";

describe("user", () => {
  test("create new user", () => {
    return request(app)
      .post("/user")
      .send({
        id: 0,
        name: "関技　太郎",
        email: "kangi@kangi3d.com",
        phonenumber: "0745-78-5388",
        task: "",
        absent: "",
        is_student: false,
      })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  test("update existing user", () => {
    return request(app)
      .patch("user")
      .send({
        task: "Test the express.js",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.task).toBe("Test the express.js");
      });
  });
});
