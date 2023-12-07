import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';

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
      selected: props.selected,
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
    const {isInventory, code_name} = this.props;
    let isSelected = selected.id === item.id;

    let name = item.name;

    if (isInventory) {
      name = item.item_name;
    }
    if (code_name) {
      name = item.code_name;
      isSelected = selected.code_id === item.code_id;
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
    const {useSearch, data, isInventory, code_name} = this.props;

    let list = data;
    if (useSearch) {
      if (isInventory) {
        list = data.filter((item) =>
          item.item_name.toLowerCase().includes(search.toLowerCase())
        );
      } if (code_name) {
        list = data.filter((item) =>
          item.code_name.toLowerCase().includes(search.toLowerCase())
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
    const {title, value, error, containerStyle, placeholder, editable} =
      this.props;
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
              style={{
                marginLeft: 3,
                color: 'black',
                flexWrap: 'wrap',
                flex: 1,
              }}>
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
