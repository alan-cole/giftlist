import { Connector } from './connector.js'

// const host = (typeof window === 'undefined') ? import.meta.env.VITE_GL_API : window.location.origin
const host = import.meta.env.VITE_GL_API
const token = localStorage.getItem('token') || ''

export default new Connector(host, token)
