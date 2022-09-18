import * as coastActions from "./coastActions";
const initialState = {
  myCoasts: [],
  error: null,
  loading: false,
};

const coastReducer = (state = initialState, action) => {
  switch (action.type) {
    case coastActions.GET_COASTS_BEGIN:
      return { ...state, loading: true };
    case coastActions.GET_COASTS_SUCCESS:
      return {
        ...state,
        myCoasts: action.payload.myCoasts,
      };
    case coastActions.getCoastsFailure:
      return {
        ...state,
        myCoasts: action.payload.error,
      };
    default:
      return state;
  }
};
export default coastReducer;
