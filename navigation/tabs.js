import React from 'react';
import {TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import {setTradeModalVisibility} from '../stores/tab/TabActions';
import {Home, Portfolio, Market, Profile} from '../screens';
import {COLORS, icons} from '../constants';
import {TabIcon} from '../components';

const Tab = createBottomTabNavigator();
const TabBarCustomButton = ({children, onPress}) => {
  return (
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const Tabs = ({setTradeModalVisibility, isTradeModalVisible}) => {
  function tradeTabButtonOnClickHandler() {
    setTradeModalVisibility(!isTradeModalVisible);
  }
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: COLORS.primary,
          borderTopColor: 'transparent',
          height: 140,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            if (!isTradeModalVisible) {
              return (
                <TabIcon focused={focused} icon={icons.home} label="Home" />
              );
            }
          },
        }}
        listeners={{
          tabpress: e => {
            if (isTradeModalVisible) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={Portfolio}
        options={{
          tabBarIcon: ({focused}) => {
            if (!isTradeModalVisible) {
              return (
                <TabIcon
                  focused={focused}
                  icon={icons.briefcase}
                  label="Wallet"
                />
              );
            }
          },
        }}
        listeners={{
          tabpress: e => {
            if (isTradeModalVisible) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen
        name="Trade"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <TabIcon
                focused={focused}
                icon={isTradeModalVisible ? icons.close : icons.trade}
                iconStyle={isTradeModalVisible ? {width: 15, height: 15} : null}
                label="Menu"
                isTrade={true}
              />
            );
          },
          tabBarButton: props => (
            <TabBarCustomButton
              {...props}
              onPress={() => tradeTabButtonOnClickHandler()}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={Market}
        options={{
          tabBarIcon: ({focused}) => {
            if (!isTradeModalVisible) {
              return (
                <TabIcon
                  focused={focused}
                  icon={icons.market}
                  label="Monitors"
                />
              );
            }
          },
        }}
        listeners={{
          tabpress: e => {
            if (isTradeModalVisible) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => {
            if (!isTradeModalVisible) {
              return (
                <TabIcon
                  focused={focused}
                  icon={icons.information}
                  label="About"
                />
              );
            }
          },
        }}
        listeners={{
          tabpress: e => {
            if (isTradeModalVisible) {
              e.preventDefault();
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};

function mapStateToProps(state) {
  return {
    isTradeModalVisible: state.tabReducer.isTradeModalVisible,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setTradeModalVisibility: isVisible => {
      return dispatch(setTradeModalVisibility(isVisible));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
