import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { COLORS, FONTS, icons, SIZES } from "../constants";

const Stat = ({
  title,
  energyConsumed,
  prc,
  subTitle,
  thisDate,
  lastDate,
  diffEnergyConsumed,
  lastEnergyConsumed,
  prcColor,
  unity,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={{
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
      }}
    >
      <View
        style={{
          width: 60,
        }}
      >
        <Image
          source={icon}
          style={{ width: 40, height: 40, tintColor: COLORS.lightGray3 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>{title}</Text>
        <Text style={{ color: COLORS.lightGray3, ...FONTS.h5 }}>
          {thisDate}
        </Text>
        <Text style={{ color: COLORS.lightGray3, ...FONTS.h5 }}>
          {energyConsumed} {unity}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>{subTitle}</Text>
        <Text style={{ color: COLORS.lightGray3, ...FONTS.h5 }}>
          {lastDate}
        </Text>
        <Text style={{ color: COLORS.lightGray3, ...FONTS.h5 }}>
          {lastEnergyConsumed} {unity}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            justifyContent: "flex-end",
            color: COLORS.white,
            ...FONTS.h4,
          }}
        >
          Difference
        </Text>
        <Text
          style={{
            justifyContent: "flex-end",
            color: COLORS.lightGray3,
            ...FONTS.h5,
          }}
        >
          {diffEnergyConsumed} {unity}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {prc != 0 && (
            <Image
              source={icons.upArrow}
              style={{
                height: 10,
                width: 10,
                tintColor: prcColor,
                transform:
                  prc > 0 ? [{ rotate: "45deg" }] : [{ rotate: "125deg" }],
              }}
            />
          )}
          <Text
            style={{
              marginLeft: 5,
              color: prcColor,
              ...FONTS.h5,
            }}
          >
            {prc}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Stat;
