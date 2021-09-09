module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://ubiz_root:tahadam.2106@ubiz.fr:27017/ubizStore'
}
