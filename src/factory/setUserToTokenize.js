
module.exports = (user) => {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    scope: user.scope,
    phone: user.phone
  }
}
