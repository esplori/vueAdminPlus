import { get, post } from '@/utils/axios.js'
import contextPath from '@/config/context-path.js'

export async function getTbkShopListApi(data) {
  const url = `${contextPath}/tbk/getShopList`
  const options = {}
  return get(url, data, options)
}
export async function getTbkListApi(data) {
  const url = `${contextPath}/tbk/getList/${data.page}`
  const options = {}
  return get(url, {}, options)
}

export async function getCateApi (data) {
  const url = `${contextPath}/tbk/getCate`
  const options = {}
  return get(url, data, options)
}

export async function insertCateApi (data) {
  const url = `${contextPath}/tbk/insertCate`
  const options = { showLoading: true }
  return post(url, data, options)
}

export async function updateCateApi (data) {
  const url = `${contextPath}/tbk/updateCate`
  const options = { showLoading: true }
  return post(url, data, options)
}
export async function delCateApi (data) {
  const Url = `${contextPath}/tbk/delCate`
  const options = { showLoading: true }
  return post(Url, data, options)
}
export async function delTbkApi (data) {
  const Url = `${contextPath}/tbk/delItem`
  const options = { showLoading: true }
  return post(Url, data, options)
}