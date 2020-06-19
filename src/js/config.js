const configs = {
  apiHosts:['http://localhost:8080/api','https://m.nz86.com','http://localhost:8080'],
  webHosts:['http://localhost:8080','https://m.nz86.com']
}
const apiHost = configs.apiHosts[2];
const webHost = configs.webHosts[0]
const config = {
  apiHost,
  webHost
}
export default config