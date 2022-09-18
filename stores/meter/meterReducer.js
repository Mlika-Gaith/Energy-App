import * as meterActions from "./meterActions";
const initialState = {
  myMeters: [],
  error: null,
  loading: false,
};

const meterReducer = (state = initialState, action) => {
  switch (action.type) {
    case meterActions.GET_METERS_BEGIN:
      return { ...state, loading: true };
    case meterActions.GET_METERS_SUCCESS:
      return {
        ...state,
        myMeters: action.payload.myMeters,
      };
    case meterActions.GET_METERS_FAILURE:
      return {
        ...state,
        myMeters: action.payload.error,
      };
    default:
      return state;
  }
};
export default meterReducer;
