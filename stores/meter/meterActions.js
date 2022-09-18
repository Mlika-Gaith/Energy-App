import axios from "axios";

export const GET_METERS_BEGIN = "GET_METERS_BEGIN";
export const GET_METERS_SUCCESS = "GET_METERS_SUCCESS";
export const GET_METERS_FAILURE = "GET_METERS_FAILURE";

export const getMetersBegin = () => ({
  type: GET_METERS_BEGIN,
});

export const getMetersSuccess = (myMeters) => ({
  type: GET_METERS_SUCCESS,
  payload: { myMeters },
});

export const getMetersFailure = (error) => ({
  type: GET_METERS_FAILURE,
  payload: { error },
});

export function getMeters() {
  return async (dispatch) => {
    dispatch(getMetersBegin());
    let apiUrl = "http://192.168.1.13:8082/meters/";
    return await axios({
      url: apiUrl,
      method: "GET",
      header: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        //console.log(response);
        if (response.status == 200) {
          let myMeters = response.data;
          dispatch(getMetersSuccess(myMeters));
        } else {
          dispatch(getMetersFailure(response.data));
        }
      })
      .catch((error) => {
        dispatch(getMetersFailure(error));
      });
  };
}
