module.exports = (fn)=> {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}
//this is better version of the Try Catch blocks