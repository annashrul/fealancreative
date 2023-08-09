import { message } from "antd";
import "antd/dist/antd.css";

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const getPropsUpload = (fileList, callback) => {
  return {
    name: "file",
    multiple: false,
    onRemove: (file) => {
      callback([]);
    },
    beforeUpload: (file) => {
      if (
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/jpeg"
      ) {
        callback([file]);
        return false;
      } else {
        message.error(`Silahkan Upload Gambar Sesuai Dengan Ketentuan`);
        return false;
      }
    },
    fileList,
  };
};

export const currency = (amount)=>{
  return new Intl.NumberFormat().format(amount);
}

export const generateNo = (i, current_page, perpage = 10) => {
  return i + 1 + perpage * (parseInt(current_page, 10) - 1);
};


export const handleOnError = (e) => {
  e.target.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png";
}


export const rmComma=(val)=>val?.replaceAll(",","")
