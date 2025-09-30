import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  // Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';

import Button from './FullButton';
import ButtonWhite from './ButtonWhite';
import RadioButton from './RadioButton';
import Text from './Text';
import styles from './Styles/InputStyle';
import {ApplicationStyles, Colors} from '../Themes';
import Icon from 'react-native-vector-icons/AntDesign';

class InputSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selected: props.selected || {},
      search: '',
    };
  }

  setSelected() {
    this.showModal(false);
    this.props.onSelect(this.state.selected);
  }

  setHeight() {
    const height = 25 * (this.props.data ? this.props.data.length : 1);
    return height > 400 ? 400 : height;
  }

  showModal(visible) {
    this.setState({visible, search: ''});
  }

  renderItem({item, index}) {
    const {selected} = this.state;
    const {isEntity, isCustomer, isBarang, isLocation, isBranch} = this.props;
    let isSelected = selected.id === item.id;

    let name = item.name;

    if (isEntity) {
      name = item.en_desc;
      isSelected = selected.en_id === item.en_id;
    } else if (isCustomer) {
      name = `Code: ${item.ptnr_code}\nSold To: ${item.ptnr_name}\nAddress: ${item.ptnra_line_1}`;
      isSelected = selected.ptnr_oid === item.ptnr_oid;
    } else if (isBarang) {
      name = `Code: ${item.pt_code}\nDesc: ${item.pt_desc1}`;
      isSelected = selected.pt_id === item.pt_id;
    } else if (isLocation) {
      name = item.loc_desc;
      isSelected = selected.loc_oid === item.loc_oid;
    } else if (isBranch) {
      name = item.branch_name;
      isSelected = selected.branch_id === item.branch_id;
    }

    return (
      <RadioButton
        text={name}
        checked={selected && isSelected}
        onPress={() => this.setState({selected: item})}
      />
    );
  }

  renderData() {
    const {search} = this.state;
    const {
      useSearch,
      data,
      isEntity,
      isCustomer,
      isBarang,
      isLocation,
      isBranch,
    } = this.props;

    let list = data;
    if (useSearch) {
      if (isEntity) {
        list = data.filter((item) =>
          item.en_desc.toLowerCase().includes(search.toLowerCase())
        );
      } else if (isCustomer) {
        list = data.filter(
          (item) =>
            item.ptnr_name.toLowerCase().includes(search.toLowerCase()) ||
            item.ptnr_code.toLowerCase().includes(search.toLowerCase()) ||
            item.ptnra_line_1.toLowerCase().includes(search.toLowerCase())
        );
      } else if (isBarang) {
        list = data.filter(
          (item) =>
            item.pt_code.toLowerCase().includes(search.toLowerCase()) ||
            item.pt_desc1.toLowerCase().includes(search.toLowerCase())
        );
      } else if (isLocation) {
        list = data.filter((item) =>
          item.loc_desc.toLowerCase().includes(search.toLowerCase())
        );
      } else if (isBranch) {
        list = data.filter((item) =>
          item.branch_name.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        list = data.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    return list;
  }

  renderModal() {
    const {useSearch} = this.props;
    const data = this.renderData();

    return (
      <Modal animationType="fade" transparent visible={this.state.visible}>
        <View style={ApplicationStyles.backgroundModal}>
          <View
            style={[
              ApplicationStyles.containerModal,
              {height: this.setHeight() + 225},
            ]}>
            <Text style={ApplicationStyles.headerTitle}>
              Choose {this.props.title}
            </Text>

            {useSearch && (
              <TextInput
                placeholder="search"
                onChangeText={(txt) => this.setState({search: txt})}
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 5,
                  borderColor: Colors.greyLight,
                }}
              />
            )}

            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              style={{height: this.setHeight()}}
              extraData={this.state}
              renderItem={(item) => this.renderItem(item)}
            />

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <ButtonWhite
                onPress={this.showModal.bind(this, false)}
                style={{height: 40, width: '45%', marginTop: 15}}
                text="BATAL"
              />

              <Button
                onPress={() => this.setSelected()}
                style={{height: 40, width: '45%'}}
                text="PILIH"
                textSize={11}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const {
      title,
      value,
      error,
      containerStyle,
      placeholder,
      editable,
      textStyle,
    } = this.props;
    const showError = !!(error && error.length > 0);

    return (
      <View style={[containerStyle, {marginBottom: 10}]}>
        {title ? (
          <Text style={[styles.label, {marginBottom: 5}]}>{title}</Text>
        ) : null}
        <TouchableOpacity
          disabled={!editable}
          style={[
            styles.container,
            {
              height: 47,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}
          onPress={this.showModal.bind(this, true)}>
          {placeholder && !value ? (
            <Text
              style={{color: Colors.placeholder, marginLeft: 3, fontSize: 17}}>
              {placeholder}
            </Text>
          ) : (
            <Text
              style={
                ({
                  marginLeft: 3,
                  color: 'black',
                  flexWrap: 'wrap',
                  flex: 1,
                },
                textStyle)
              }>
              {value}
            </Text>
          )}

          <Icon name="down" size={15} color={Colors.primary} />
        </TouchableOpacity>
        {showError ? <Text style={styles.error}>{error}</Text> : null}
        {this.renderModal()}
      </View>
    );
  }
}

InputSelect.defaultProps = {
  title: '',
  keyValue: '',
  name: '',
  value: '',
  error: '',
  data: [],
  renderItem: (item) => {},
  onSelect: (item) => {},
  style: {},
};

export default InputSelect;
