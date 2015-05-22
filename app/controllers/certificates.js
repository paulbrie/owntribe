var url = require('url');

function render(req, res) {
  var url_parts = url.parse(req.url, true);
  var queryString = url_parts.query;

  res.render('certificates', {
    firstName  : queryString.fn || '',
    lastName : queryString.ln || '',
    course: queryString.c || ''
  });
}

module.exports = function(app) {
  return {
    index: function (req, res) {
      if (!req.session.user.logged) {
        res.redirect('/login');
      } else {
        render(req, res);
      }
    }
  }
}