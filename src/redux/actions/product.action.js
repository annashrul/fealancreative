import { PRODUCT, AUTH } from "../type";
import axios from "axios";

import { Message, notification } from "antd";
export const setData = (data) => {
  return {
    type: PRODUCT.GET,
    data,
  };
};
export const setPagination = (data) => {
  return {
    type: PRODUCT.PAGINATION,
    data,
  };
};

export const setLoadingGet = (load) => {
  return {
    type: PRODUCT.GET_LOADING,
    load,
  };
};
export const setLoadingPost = (load) => {
  return {
    type: PRODUCT.POST_LOADING,
    load,
  };
};

export const getProduct = (where = "") => {
  return (dispatch) => {
    dispatch(setLoadingGet(true));
    axios
      .get(AUTH.URL + "product" + where)
      .then(function (response) {
        const data = response.data;
        console.log("data",data)
        dispatch(setData(data));
        dispatch(setPagination(data));
        dispatch(setLoadingGet(false));
      })
      .catch(function (err) {
        dispatch(setLoadingGet(false));
        let msg = "Terjadi Kesalahan Jaringan";
        const key = `open${Date.now()}`;
        notification.error({
          message: "Terjadi Kesalahan",
          description: msg,
          key,
          onClose: () => {},
        });

        // handle error
      });
  };
};

export const storeProduct = (data, where, callback) => {
  return (dispatch) => {
    dispatch(setLoadingPost(true));
    axios
      .post(AUTH.URL + "product", data)
      .then(function (response) {
        dispatch(getProduct(where));
        dispatch(setLoadingPost(false));
        callback();
      })
      .catch(function (err) {
        dispatch(setLoadingPost(false));
        let msg = "Terjadi Kesalahan Jaringan";
        const key = `open${Date.now()}`;
        notification.error({
          message: "Terjadi Kesalahan",
          description: msg,
          key,
          onClose: () => {},
        });

        // handle error
      });
  };
};

export const putProduct = (data, id, where, callback) => {
  return (dispatch) => {
    dispatch(setLoadingPost(true));
    axios
      .put(AUTH.URL + "product/" + id, data)
      .then(function (response) {
        dispatch(getProduct(where));
        dispatch(setLoadingPost(false));
        callback();
      })
      .catch(function (err) {
        dispatch(setLoadingPost(false));
        let msg = "Terjadi Kesalahan Jaringan";
        const key = `open${Date.now()}`;
        notification.error({
          message: "Terjadi Kesalahan",
          description: msg,
          key,
          onClose: () => {},
        });

        // handle error
      });
  };
};

export const deleteProduct = (id, where) => {
  return (dispatch) => {
    axios
      .delete(AUTH.URL + "product/" + id)
      .then(function (response) {
        dispatch(getProduct(where));
      })
      .catch(function (err) {
        let msg = "Terjadi Kesalahan Jaringan";
        const key = `open${Date.now()}`;
        notification.error({
          message: "Terjadi Kesalahan",
          description: msg,
          key,
          onClose: () => {},
        });

        // handle error
      });
  };
};
