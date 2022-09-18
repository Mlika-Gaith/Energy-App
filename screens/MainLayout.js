import React from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Animated, View} from 'react-native';
import {COLORS, SIZES, icons} from '../constants';
import {IconTextButton} from '../components';

const MainLayout = ({children, isTradeModalVisible}) => {
  const modalAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  React.useEffect(() => {
    if (isTradeModalVisible) {
      Animated.timing(modalAnimatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(modalAnimatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [isTradeModalVisible]);
  const modalY = modalAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SIZES.height, SIZES.height - 290],
  });
  return (
    <View style={{flex: 1}}>
      {children}
      {isTradeModalVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.transparentBlack,
          }}
          opacity={modalAnimatedValue}
        />
      )}

      <Animated.View
        style={{
          position: 'absolute',
          top: modalY,
          left: 0,
          width: '100%',
          padding: SIZES.padding,
          backgroundColor: COLORS.primary,
        }}>
        <IconTextButton
          label="Add Monitor"
          icon={icons.add}
          onPress={() => navigation.navigate('AddNew')}
        />
        <IconTextButton
          label="Report"
          icon={icons.report}
          containerStyle={{marginTop: SIZES.base}}
          onPress={() => navigation.navigate('Report')}
        />
      </Animated.View>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    isTradeModalVisible: state.tabReducer.isTradeModalVisible,
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
