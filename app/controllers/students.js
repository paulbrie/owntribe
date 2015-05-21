function render(req, res) {
  res.render('students', {
    h1  : "Students",
    user: req.session.user
  });
}

module.exports = function(app) {
  return {
    index: function(req, res) {
      if(!req.session.user.logged) {
        res.redirect('/login');
      } else {
        render(req, res);
      }
    }
  }
}
