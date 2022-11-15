const User = require("../models/user.model");
const authUtil = require('../util/authentication')

function getSignup(req, res) {
  res.render("customer/auth/signup");
}

async function signup(req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  await user.signup();

  res.redirect('/login');
}

function getLogin(req, res) {
  res.render('customer/auth/login');
}

async function Login(req, res){
  const user = new User(req.body.email, req.body.password)
  const exisingUser = await user.getUserWithSameEmail();

  if(!exisingUser){
    res.render('./login');
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(exisingUser.password);

  if(!passwordIsCorrect){
    res.redirect('./login');
    return;
  }

  authUtil.createUserSession(req, exisingUser, function() {
    res.redirect('/')
  })
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
};
