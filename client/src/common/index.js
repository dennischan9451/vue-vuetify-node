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
  let thisTime =
    time.getFullYear() +
    "-" +
    Number(time.getMonth() + 1) +
    "-" +
    time.getDate();
  return thisTime;
};

export default { setAuthToken, wellDate };
