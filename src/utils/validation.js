const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid Name!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Weak password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEdits = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEdits.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
