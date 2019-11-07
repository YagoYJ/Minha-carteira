if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://<username>:<password>@test-4wgyg.mongodb.net/test?retryWrites=true&w=majority"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/MinhaCarteira"
  };
}
