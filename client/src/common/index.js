import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // Apply to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    //Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

const wellDate = timestr => {
  var time = new Date(timestr);
  if (!time.getTime() > 0) {
    return ""
  }

  var month =
    Number(time.getMonth() + 1) < 10
      ? "0" + Number(time.getMonth() + 1)
      : Number(time.getMonth() + 1);
  var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  let thisTime = time.getFullYear() + "-" + month + "-" + day;
  return thisTime;
};

export default { setAuthToken, wellDate };
