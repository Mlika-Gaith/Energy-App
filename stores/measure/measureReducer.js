import * as measureActions from "./measureActions";
const initialState = {
  myMeasures: [],
  error: null,
  loading: false,
};
const measureReducer = (state = initialState, action) => {
  switch (action.type) {
    case measureActions.GET_MEASURES_BEGIN:
      return { ...state, loading: true };
    case measureActions.GET_MEASURES_SUCCESS:
      return {
        ...state,
        myMeasures: action.payload.myMeasures,
      };
    case measureActions.GET_MEASURES_FAILURE:
      return {
        ...state,
        myMeasures: action.payload.error,
      };
    default:
      return state;
  }
};
export default measureReducer;
