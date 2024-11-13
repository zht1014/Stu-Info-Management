import { get } from "./request";
const baseUrl = "http://128.199.224.162:8080";

export const getUserInfo = (p) => get(baseUrl + "/user");
export const getAllCourses = (p, headers) => get(baseUrl + "/api/course", p, headers);
