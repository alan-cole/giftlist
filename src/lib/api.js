import API from '../../setup/scripts/api'

const apiInstance = new API(process.env.GL_API || window.location.origin)

export default apiInstance
