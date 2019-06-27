import API from '../../setup/scripts/api'

const host = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000' : '/'

export default new API(host)
