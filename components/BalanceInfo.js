import React from 'react';
import {View, Text, Image} from 'react-native';
import {NativeScreen} from 'react-native-screens';
import {COLORS, SIZES, FONTS, icons} from '../constants';

const BalanceInfo = ({
  displayAmount,
  title,
  changePct,
  containerStyle,
  time,
  type,
}) => {
  return (
    <View style={{...containerStyle}}>
      <Text
        style={{
          ...FONTS.h3,
          color: COLORS.lightGray,
        }}>
        {title}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.lightGray3,
          }}>
          {type === 'power' ? (
            <Image
              source={icons.energy}
              style={{height: 25, width: 25, tintColor: COLORS.lightGray3}}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={icons.money}
              style={{height: 25, width: 25, tintColor: COLORS.lightGray3}}
              resizeMode="contain"
            />
          )}
        </Text>
        <Text
          style={{marginLeft: SIZES.base, ...FONTS.h2, color: COLORS.white}}>
          {displayAmount.toLocaleString()}
        </Text>
        <Text
          style={{
            color: COLORS.lightGray,
            ...FONTS.h3,
            marginLeft: SIZES.base,
          }}>
          {type === 'power' ? 'kWh' : 'TD'}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        {changePct != !0 && (
          <Image
            source={icons.upArrow}
            style={{
              width: 10,
              height: 10,
              alignSelf: 'center',
              tintColor:
                changePct > 0
                  ? COLORS.lightRed
                  : changePct == 0
                  ? COLORS.lightGray
                  : COLORS.lightGreen,
              transform:
                changePct > 0 ? [{rotate: '45deg'}] : [{rotate: '125deg'}],
            }}
          />
        )}
        <Text
          style={{
            marginLeft: SIZES.base,
            alignSelf: 'flex-end',
            color:
              changePct == 0
                ? COLORS.lightGray3
                : changePct > 0
                ? COLORS.lightRed
                : COLORS.lightGreen,
          }}>
          {changePct.toFixed(2)} %
        </Text>
        <Text
          style={{
            marginLeft: SIZES.radius,
            alignSelf: 'flex-end',
            color: COLORS.lightGray3,
            ...FONTS.h5,
          }}>
          {time ? time : 'unknown'}
        </Text>
      </View>
    </View>
  );
};

export default BalanceInfo;
