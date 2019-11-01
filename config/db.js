if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://<user>:<password>@minhacarteira-cw3eh.mongodb.net/test?retryWrites=true&w=majority"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/MinhaCarteira"
  };
}
