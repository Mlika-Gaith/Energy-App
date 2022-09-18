import React from 'react';
import {View, Text, Image} from 'react-native';

import {COLORS, FONTS, SIZES} from '../constants';
export const HeaderBar = ({title}) => {
  return (
    <View
      style={{
        height: 100,
        paddingHorizontal: SIZES.radius,
        justifyContent: 'flex-end',
      }}>
      <Text style={{color: COLORS.white, ...FONTS.largeTitle}}>{title}</Text>
    </View>
  );
};
export const RenderSubHeader = ({
  title,
  icon,
  value,
  unity,
  containerStyle,
}) => {
  return (
    <View style={{...containerStyle}}>
      <Text
        style={{
          color: COLORS.lightGray,
          ...FONTS.h3,
          textTransform: 'capitalize',
        }}>
        {title}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.lightGray3,
          }}>
          <Image
            source={icon}
            style={{height: 25, width: 25, tintColor: COLORS.lightGray3}}
            resizeMode="contain"
          />
        </Text>
        <Text
          style={{marginLeft: SIZES.base, ...FONTS.h2, color: COLORS.white}}>
          {value}
        </Text>
        <Text
          style={{
            color: COLORS.lightGray,
            ...FONTS.h3,
            marginLeft: SIZES.base,
          }}>
          {unity}
        </Text>
      </View>
    </View>
  );
};
