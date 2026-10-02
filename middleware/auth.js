const isAuth = (req, res, next) => {
  if (req.session && req.session.user) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect('/login?msg=Please login to continue');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  res.status(403).render('pages/error', { title: 'Access Denied | FOODORA', message: 'Admin access required.' });
};

const isOwner = (req, res, next) => {
  if (req.session && req.session.user &&
    (req.session.user.role === 'restaurant_owner' || req.session.user.role === 'admin')) return next();
  res.status(403).render('pages/error', { title: 'Access Denied | FOODORA', message: 'Restaurant owner access required.' });
};

const isGuest = (req, res, next) => {
  if (req.session && req.session.user) return res.redirect('/');
  next();
};

module.exports = { isAuth, isAdmin, isOwner, isGuest };
