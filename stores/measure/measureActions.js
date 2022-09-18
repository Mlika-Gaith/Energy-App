import axios from 'axios';

export const GET_MEASURES_BEGIN = 'GET_MEASURES_BEGIN';
export const GET_MEASURES_SUCCESS = 'GET_MEASURES_SUCCESS';
export const GET_MEASURES_FAILURE = 'GET_MEASURES_FAILURE';

export const getMeasureBegin = () => ({
  type: GET_MEASURES_BEGIN,
});
export const getMeasureSuccess = myMeasures => ({
  type: GET_MEASURES_SUCCESS,
  payload: {myMeasures},
});
export const getMeasureFailure = error => ({
  type: GET_MEASURES_FAILURE,
  payload: {error},
});
export function getMeasures() {
  return async dispatch => {
    dispatch(getMeasureBegin());
    let apiUrl = 'http://192.168.1.13:8082/measures/getmeasures';
    return await axios({
      url: apiUrl,
      method: 'GET',
      header: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        //console.log(response);
        if (response.status == 200) {
          let myMeasures = response.data;
          dispatch(getMeasureSuccess(myMeasures));
        } else {
          dispatch(getMeasureFailure(response.data));
        }
      })
      .catch(error => {
        //console.log(error);
        dispatch(getMeasureFailure(error));
      });
  };
}
