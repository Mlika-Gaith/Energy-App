import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {COLORS, SIZES, FONTS, SHADOWS} from '../constants';
export const CircleButton = ({icon, onPress, containerStyle}) => {
  return (
    <TouchableOpacity
      style={{
        width: 45,
        height: 45,
        backgroundColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.light,
        marginTop: SIZES.padding,
        ...containerStyle,
      }}
      onPress={() => onPress()}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{width: 28, height: 28, tintColor: COLORS.white}}
      />
    </TouchableOpacity>
  );
};
