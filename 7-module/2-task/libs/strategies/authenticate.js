const User = require('./../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }
  User.findOne({email: email}).then((user) => {
    if (!user) {
      user = new User({email, displayName});
      user.save().then(
          (result) => {
            done(null, user);
          },
          (err) => {
            done(err, false, err.errors.email.message);
          });
    } else {
      done(null, user);
    }
  });
};
