import { PRODUCT } from "../type";
const initialState = {
  data: [],
  pagination: [],
  loadingGet: true,
  loadingPost: false,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT.GET:
      return {
        ...state,
        data: action.data.data,
      };
    case PRODUCT.PAGINATION:
      console.log("pagination", action.data);
      return {
        ...state,
        pagination: action.data,
      };
    case PRODUCT.GET_LOADING:
      return Object.assign({}, state, {
        loadingGet: action.load,
      });
    case PRODUCT.POST_LOADING:
      return Object.assign({}, state, {
        loadingPost: action.load,
      });
    default:
      return state;
  }
};
