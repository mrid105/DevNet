const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  console.log("Admin Auth is done!");
  if (!isAdminAuthorized) {
    res.send("Unauthorized Request!");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  console.log("User Auth is done!");
  if (!isUserAuthorized) {
    res.send("Unauthorized Request!");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
