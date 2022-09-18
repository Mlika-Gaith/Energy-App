import React from 'react';
import {ToastAndroid} from 'react-native';
export default function showToast(text) {
  ToastAndroid.showWithGravityAndOffset(
    text,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
}
