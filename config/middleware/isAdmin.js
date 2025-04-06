const isAdmin = async (req, res, next) => {
  const { role } = req.user;
  if (role === "user") {
    // It checks the user is normal user or not

    res.status(403).json({
      message: "You are not authorized ,Access Denied",
    });
  }

  // ? next() can be called if not an normal user  it accepts 1) superAdmin 2) admin
  next();
};

module.exports = isAdmin;
