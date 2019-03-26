const fs        = require('fs')
const apiserver = require('apiserver')

// Load Local Settings.
var data = fs.readFileSync('./config.json', 'utf-8')
config = JSON.parse(data)

// Start Server
apiserver.start(config)
