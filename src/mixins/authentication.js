const authenticatedPage = {
  created () {
    // Redirect user to home if not logged in.
    if (localStorage.getItem('token') === null) {
      this.$router.push('/')
    }
  }
}

export default authenticatedPage
