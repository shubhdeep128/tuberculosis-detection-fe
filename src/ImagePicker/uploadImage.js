import axios from "axios";
import { serverUrl } from "../../constants";
async function uploadImage(uri, next) {
  let name = uri.split("/").pop();
  let match = /\.(\w+)$/.exec(name);
  let type = match ? `image/${match[1]}` : `image`;
  const data = new FormData();
  data.append("files", {
    uri,
    name,
    type,
  });
  // console.log(data);
  axios
    .post(`${serverUrl}api/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log("result" + res.data);
      next(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
  // axios
  //   .get(`http://ec2-13-126-33-238.ap-south-1.compute.amazonaws.com:5050/api`)
  //   .then((res) => {
  //     console.log(res.data);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
}

export default uploadImage;
