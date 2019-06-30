import Connector from '../../lib/connector'

const host = process.env.GL_API || window.location.origin
const token = localStorage.getItem('token') || ''

const apiInstance = new Connector(host, token)

export default apiInstance
