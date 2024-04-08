const Yup = require("yup");
const formSchema = Yup.object({
  username: Yup.string()
    .required("username required!")
    .min(6, "username is too short")
    .max(20, "username is too long"),
  password: Yup.string()
    .required("password required!")
    .min(6, "password is too short")
    .max(20, "password is too long"),
});
const validateForm = (req, res, next) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch((err) => {
      console.log(err.errors);
      res.status(422).send();
    })
    .then((valid) => {
      if (valid) {
        console.log("form is good");
        next();
      } else {
        console.log(err.errors);
        res.status(422).send();
      }
    });
};
module.exports = validateForm;
