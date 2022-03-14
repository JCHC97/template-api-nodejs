import axios from 'axios'
let instance = null
const HttpException = require('@utils/HttpException')

// const host = config.host
const host = ''

const setUrl = (url = '', query = {}) => {
  url = url.startsWith('http://') || url.startsWith('https://') ? url : `${host}/${url}`

  const queryParams = Object.entries(query).reduce((acc, [key, value]) => {
    const separator = acc ? '&' : '?'
    return acc.concat(`${separator}${key}=${value}`)
  }, '')
  console.log({ url, queryParams })
  return url + queryParams
}

const getToken = () => ({})

const handleError = (err, msgHead) => {
  console.log(`handleError`)
  console.log(`${msgHead} ${err.message}`)
  return HttpException(`${msgHead} ${err.message}`, err.statusCode)
}

/* const getToken = () => {
    const tokenStorage = window.localStorage.getItem('token')
    const accessToken = tokenStorage ? `Bearer ${tokenStorage}` : ''
    return accessToken
} */

axios.interceptors.request.use(req => {
  // console.log({ url: req.url })
  return req
}, err => console.error(err))

axios.interceptors.response.use(res => {
  // console.log('interceptors', {res})
  if (!res) throw HttpException('No se obtuvo respuesta, por favor verifique su conexión a internet.')
  return res
}, err => err.response)

class Http {
  //  static instance = null
  static get instance() {
    if (instance === null) instance = new Http()
    return instance
  }

  get = ({ url, query, headers = {} }) =>
    axios.get(setUrl(url, query), {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(err, `[GET] ${url}:`) })

  post = ({ url, query, body = {}, headers = {} }) =>
    axios.post(setUrl(url, query), body, {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(err, `[POST] ${url}:`) })

  put = ({ url, query, body = {}, headers = {} }) =>
    axios.put(setUrl(url, query), body, {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(err, `[PUT] ${url}:`) })

  patch = ({ url, query, body = {}, headers = {} }) =>
    axios.patch(setUrl(url, query), body, {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(err, `[PATCH] ${url}:`) })

  delete = (url, query, headers = {}) =>
    axios.delete(setUrl(url, query), {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        Authorization: getToken(),
        'Content-Type': 'application/json',
        ...headers
      }
    }).then(res => res)
      .catch(err => { throw handleError(err, `[DELETE] ${url}:`) })

}


module.exports = Http