import api from './api'

export default {
  setSession (index) {
    const sessions = this.getSessions()
    const token = sessions[index].token
    this.setToken(token)
  },
  addSession (name, token) {
    let sessions = localStorage.getItem('sessions')
    sessions = sessions ? JSON.parse(sessions) : { sessions: [] }
    sessions.sessions.push({ name, token })
    localStorage.setItem('sessions', JSON.stringify(sessions))
  },
  deleteSession (index) {
    const sessions = JSON.parse(localStorage.getItem('sessions'))
    if (sessions.sessions[index].token === this.getToken()) {
      alert('Unable to remove an active session')
    } else {
      sessions.sessions.splice(index, 1)
      localStorage.setItem('sessions', JSON.stringify(sessions))
    }
  },
  deleteAll () {
    localStorage.removeItem('token')
    localStorage.removeItem('sessions')
  },
  getSessions () {
    const sessions = localStorage.getItem('sessions')
    return sessions ? JSON.parse(sessions).sessions : []
  },
  getToken () {
    return localStorage.getItem('token')
  },
  setToken (token) {
    localStorage.setItem('token', token)
    api.setToken(token)
  }
}
