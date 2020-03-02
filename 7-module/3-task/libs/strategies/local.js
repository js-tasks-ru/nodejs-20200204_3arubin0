const User = require('./../../models/User');
const LocalStrategy = require('passport-local').Strategy;
// Локальная стратегия
module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({email: email}).then((user) => {
        if (user) {
          user.checkPassword(password).then((isOk) => {
            if (isOk) {
              done(null, user);
            } else {
              done(null, false, 'Неверный пароль');
            }
          });
        } else {
          done(null, false, 'Нет такого пользователя');
        }
      }).catch((e)=>{
        console.log(e);
      });
    }
);
