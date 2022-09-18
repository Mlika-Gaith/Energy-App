import React from 'react';
import {Image, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS, icons, FONTS, SIZES} from '../constants';
import {IconTextButton} from '../components';

export const ShowModal = ({
  setModalVisible,
  isModalVisible,
  title,
  text,
  onPress,
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      animationIn="bounceInDown"
      backdropColor={COLORS.black}
      backdropOpacity={0.9}>
      <View
        style={{
          flex: 2,
          backgroundColor: COLORS.lightGray2,
          display: 'flex',
          alignItems: 'center',
          padding: SIZES.padding,
          position: 'absolute',
          top: '50%',
          alignSelf: 'center',
          zIndex: 9999,
          borderWidth: 2,
          borderRadius: SIZES.radius,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: SIZES.padding,
          }}>
          <Image
            source={icons.energy}
            style={{
              height: 30,
              width: 30,
              tintColor: COLORS.white,
              paddingRight: SIZES.padding,
              alignItems: 'center',
            }}
          />
          <Text
            style={{
              color: COLORS.white,
              textTransform: 'capitalize',
              ...FONTS.h4,
            }}>
            {title}
          </Text>
        </View>

        <Text
          style={{
            color: COLORS.lightGray3,
            ...FONTS.h4,
            textTransform: 'capitalize',
          }}>
          {text}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: SIZES.padding,
          }}>
          <IconTextButton
            label="No"
            onPress={() => setModalVisible(!isModalVisible)}
            containerStyle={{
              width: 100,
              height: 40,
            }}
            icon={icons.close2}
          />
          <IconTextButton
            label="Yes"
            onPress={() => onPress() && setModalVisible(!isModalVisible)}
            containerStyle={{width: 100, marginLeft: 20, height: 40}}
            icon={icons.check}
          />
        </View>
      </View>
    </Modal>
  );
};
