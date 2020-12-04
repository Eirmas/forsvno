const libs = {
  CA: require("./ConvertAudio")
}
exports.get = (req) => {

  CA.visualizeAudio(req.param.url)
  .then((data) => {
    return {
      body: {
        success: true,
        data: data
      }
    };
  })
  .catch((error) => {
    return {
      body: {
        success: false,
        error: error
      }
    };
  })
};
