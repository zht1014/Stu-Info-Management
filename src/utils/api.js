import { get, post, put, del } from '@/utils/request'
const baseUrl = 'http://localhost:8888'

export const getUserInfo = p => get(baseUrl + '/user')

