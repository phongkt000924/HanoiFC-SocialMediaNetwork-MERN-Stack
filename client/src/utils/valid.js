const valid = ({
  fullname,
  username,
  email,
  password,
  cf_password,
}) => {
  const err = {};

  if (!fullname) {
    err.fullname = "Vui lòng nhập đầy đủ họ và tên của bạn.";
  } else if (fullname.length > 25) {
    err.fullname = "Vui lòng không nhập họ và tên đầy đủ không quá 25 ký tự.";
  }

  if (!username) {
    err.username = "Vui lòng nhập tên người dùng của bạn.";
  } else if (username.replace(/ /g, "").length > 25) {
    err.username = "Vui lòng nhập tên người dùng không quá 25 ký tự.";
  }

  if (!email) {
    err.email = "Vui lòng nhập địa chỉ email của bạn.";
  } else if (!validateEmail(email)) {
    err.email = "Địa chỉ email không hợp lệ.";
  }

  if (!password) {
    err.password = "Vui lòng nhập mật khẩu của bạn.";
  } else if (password.length < 6) {
    err.password = "Mật khẩu của bạn phải có tối thiểu 6 ký tự.";
  }

  if (password !== cf_password) {
    err.cf_password = "Mật khẩu nhập lại không trùng khớp.";
  }

  return {
    errMsg: err,
    errLength: Object.keys(err).length,
  };
};

function validateEmail(email) {
  // eslint-disable-next-line
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default valid;
