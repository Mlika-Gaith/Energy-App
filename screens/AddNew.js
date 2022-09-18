import {View, Text, TextInput, Image, ScrollView} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {COLORS, FONTS, SIZES, icons} from '../constants';
import {IconTextButton} from '../components';
import {HeaderBar} from '../components/HeaderBar';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import showToast from '../functions/Toast';

const RenderDropBox = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  placeholder,
  title,
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginVertical: SIZES.font,
      }}>
      <Text
        style={{
          ...FONTS.h3,
          color: COLORS.lightGray,
          textTransform: 'capitalize',
          paddingHorizontal: SIZES.padding,
        }}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.padding,
        }}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={placeholder}
          theme={'DARK'}
          style={{
            width: 350,
            height: 20,
            zIndex: 999,
            alignSelf: 'center',
            backgroundColor: COLORS.gray1,
            color: COLORS.white,
          }}
          listItemContainerStyle={{
            height: 40,
            width: 350,
            backgroundColor: COLORS.gray1,
            color: COLORS.white,
          }}
          listItemLabelStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            color: COLORS.white,
          }}
          selectedItemContainerStyle={{
            color: COLORS.white,
          }}
          selectedItemLabelStyle={{
            color: COLORS.white,
          }}
          dropDownContainerStyle={{
            width: 350,
            alignSelf: 'center',
            backgroundColor: COLORS.gray1,
            color: COLORS.white,
          }}
          listMode="SCROLLVIEW"
          bottomOffset={500}
        />
      </View>
    </View>
  );
};
const RenderInputField = ({
  icon,
  placeholder,
  keyboard,
  onChangeText,
  autoFocus,
  maxLength,
  defaultValue,
  title,
}) => {
  return (
    <View style={{flexDirection: 'column'}}>
      <Text
        style={{
          ...FONTS.h3,
          color: COLORS.lightGray,
          textTransform: 'capitalize',
          paddingHorizontal: SIZES.padding,
        }}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: SIZES.padding,
          paddingHorizontal: SIZES.padding,
        }}>
        <TextInput
          style={{
            paddingTop: 9,
            paddingBottom: 9,
            paddingLeft: 9,
            backgroundColor: COLORS.primary,
            marginLeft: SIZES.base,
            color: COLORS.white,
            width: 350,
            borderRadius: 5,
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.white}
          keyboardType={keyboard}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          maxLength={maxLength}
        />
      </View>
    </View>
  );
};

function verifyInput(ID, type, residential, voltage, amperage, frequency) {
  if (ID.length === 0) {
    showToast('ID is Required');
    return false;
  } else {
    if (type.length === 0) {
      showToast('Type is required');
      return false;
    } else {
      if (
        residential.toLowerCase() !== 'residential' &&
        residential.toLowerCase() !== 'non-residential'
      ) {
        showToast('Residential can be either : Residential or Non-Residential');
        return false;
      } else {
        if (voltage !== '230') {
          showToast('voltage can only be 230V');
          return false;
        } else {
          if (amperage !== '10-40') {
            showToast('amperage can only be 10-40A');
            return false;
          } else {
            if (frequency !== '50') {
              showToast('frequency can only be 50H');
              return false;
            }
          }
        }
      }
    }
  }
  return true;
}
const AddNew = () => {
  const [ID, setID] = useState('');
  const [initialvalue, setInitialValue] = useState(0);
  const [type, setType] = useState('');
  const [residential, setResidential] = useState('');
  const [voltage, setVoltage] = useState(null);
  const [amperage, setAmperage] = useState(null);
  const [frequency, setFrequency] = useState(null);

  //  DropBox control
  const [openVoltage, setOpenVoltage] = useState(false);
  const [openAmperage, setOpenAmperage] = useState(false);
  const [openFrequency, setOpenFrequency] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openResidential, setOpenResidential] = useState(false);

  //DropBox Items
  const [voltageItems, setVoltageItems] = useState([
    {label: '230 V', value: '230'},
  ]);
  const [amperageItems, setAmperageItems] = useState([
    {label: '10-40 A', value: '10-40'},
  ]);
  const [typeItems, setTypeItems] = useState([
    {label: 'Type E967C', value: 'Type E967C'},
  ]);
  const [residentialItems, setResidentialItems] = useState([
    {label: 'Residential', value: 'residential'},
    {label: 'Non-Residential', value: 'non-residential'},
  ]);
  const [frequencyItems, setFrequencyItems] = useState([
    {label: '50 H', value: '50'},
  ]);

  const handleSubmit = async () => {
    const verify = verifyInput(
      ID,
      type,
      residential,
      voltage,
      amperage,
      frequency,
    );
    let verifyMeter = null;
    if (verify) {
      try {
        let response = await axios.get(
          'http://192.168.1.13:8082/meters/meter/' + ID,
        );
        verifyMeter = response.data;
        if (verifyMeter.length == 0) {
          let newMeter = {
            ID: ID,
            initial_value: initialvalue,
            type: type,
            residential: residential,
            voltage: voltage + 'V',
            amperage: amperage + 'A',
            frequency: frequency + 'H',
          };
          try {
            let response = await axios.post(
              'http://192.168.1.13:8082/meters/meter',
              newMeter,
            );
            showToast('Added successfully.');
          } catch (error) {
            console.log(error);
          }
        } else {
          showToast('Meter with current ID exists.');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('not verified');
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: COLORS.black}}>
      <HeaderBar title={'Add New Monitor'} />
      {/*renderInputFields*/}
      <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
        <RenderInputField
          icon={icons.verified}
          placeholder="ID"
          keyboard="number-pad"
          onChangeText={newID => setID(newID)}
          maxLength={9}
          title="Monitor ID"
        />
        <RenderInputField
          icon={icons.energy}
          placeholder="0"
          keyboard="number-pad"
          onChangeText={newInit => setInitialValue(newInit)}
          maxLength={5}
          title="Initial Monitor Value"
        />
        {
          <RenderDropBox
            open={openType}
            value={type}
            items={typeItems}
            setOpen={setOpenType}
            setValue={setType}
            setItems={setTypeItems}
            placeholder="Select Monitor Type"
            title="Select Meter Type"
            icon={icons.meter1}
          />
        }
        {
          <RenderDropBox
            open={openResidential}
            value={residential}
            items={residentialItems}
            setOpen={setOpenResidential}
            setValue={setResidential}
            setItems={setResidentialItems}
            placeholder="Select Sector Type"
            title="Select Sector Type"
            icon={icons.house_office}
          />
        }
        {
          <RenderDropBox
            open={openVoltage}
            value={voltage}
            items={voltageItems}
            setOpen={setOpenVoltage}
            setValue={setVoltage}
            setItems={setVoltageItems}
            placeholder="Select Voltage"
            title="Select Voltage"
            icon={icons.energy}
          />
        }
        {
          <RenderDropBox
            open={openAmperage}
            value={amperage}
            items={amperageItems}
            setOpen={setOpenAmperage}
            setValue={setAmperage}
            setItems={setAmperageItems}
            placeholder="Select Amperage"
            title="Select Amperage"
            icon={icons.energy}
          />
        }
        {
          <RenderDropBox
            open={openFrequency}
            value={frequency}
            items={frequencyItems}
            setOpen={setOpenFrequency}
            setValue={setFrequency}
            setItems={setFrequencyItems}
            placeholder="Select Frequency"
            title="Select Frequency"
            icon={icons.energy}
          />
        }
        {}

        <View
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingTop: SIZES.font,
            marginBottom: SIZES.padding * 2,
            justifyContent: 'center',
            backgroundColor: 'transparent',
            zIndex: 1,
          }}>
          <IconTextButton
            label="Submit"
            icon={icons.send}
            containerStyle={{width: 350, height: 50}}
            onPress={() => handleSubmit()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddNew;
