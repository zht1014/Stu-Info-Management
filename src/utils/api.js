import { get, post, put, del } from "./request";
const baseUrl = "http://localhost:8080";

export const getUserInfo = (p) => get(baseUrl + "/user");
export const getAllCourses = (p, headers) => get(baseUrl + "/api/course", p, headers);
