// middleware/auth.js
// This function checks if the user is logged in as admin.
// We "use" it on every admin route that needs protection.

function requireLogin(req, res, next) {
  // If session has admin flag, allow them through
  if (req.session && req.session.isAdmin) {
    return next();
  }
  // Otherwise redirect to login page
  res.redirect('/admin/login');
}

module.exports = { requireLogin };
