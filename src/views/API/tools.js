import { post } from '@/utils/axios.js'
import contextPath from '@/utils/context-path.js'

export async function deployApi (data) {
  const url = `${contextPath}/tools/deploy`
  const options = {}
  return post(url, data, options)
}

export async function genereateQrcodeApi (data) {
  const url = `${contextPath}/tools/genereateQrcode`
  const options = {}
  return post(url, data, options)
}
