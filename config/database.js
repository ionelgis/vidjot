if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI : 'mongodb://ionel:ionel@ds133004.mlab.com:33004/vidjot-prod'
  }
}else{
  module.exports = {
    mongoURI : 'mongodb://localhost/vidjot-dev'
  }
}