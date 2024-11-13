import { get, post, put, del } from "./request";
const baseUrl = "http://159.203.52.224";

export const getUserInfo = (p) => get(baseUrl + "/user");
export const getAllCourses = (p, headers) => get(baseUrl + "/api/course", p, headers);
