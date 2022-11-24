import axios from 'axios';

export const GET_COASTS_BEGIN = 'GET_COASTS_BEGIN';
export const GET_COASTS_SUCCESS = 'GET_COASTS_SUCCESS';
export const GET_COASTS_FAILURE = 'GET_COASTS_FAILURE';

export const getCoastsBegin = () => ({
  type: GET_COASTS_BEGIN,
});

export const getCoastsSuccess = myCoasts => ({
  type: GET_COASTS_SUCCESS,
  payload: {myCoasts},
});

export const getCoastsFailure = error => ({
  type: GET_COASTS_FAILURE,
  payload: {error},
});

export function getCoasts() {
  return async dispatch => {
    dispatch(getCoastsBegin());
    let apiUrl = 'http://ip-address:8082/coasts/';
    return await axios({
      url: apiUrl,
      method: 'GET',
      header: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (response.status == 200) {
          let myCoasts = response.data;
          dispatch(getCoastsSuccess(myCoasts));
        } else {
          dispatch(getCoastsFailure(response.data));
        }
      })
      .catch(error => {
        dispatch(getCoastsFailure(error));
      });
  };
}
