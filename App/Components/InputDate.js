import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';

import Text from './Text';
import styles from './Styles/InputStyle';
import {ApplicationStyles, Colors} from '../Themes';

class InputDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selected: props.value,
    };

    this.handleDatePicked = this.handleDatePicked.bind(this);
  }

  setSelected() {
    this.showModal(false);
    this.props.onSelect(this.state.selected);
  }

  handleDatePicked(date) {
    this.showModal(false);
    this.props.onSelect(Moment(date).format('YYYY-MM-DD HH:mm'));
  }

  showModal(visible) {
    const {notEditable} = this.props;
    if (!notEditable) {
      this.setState({visible});
    }
  }

  renderModal() {
    const {value, minimumDate, maximumDate} = this.props;

    return (
      <DateTimePickerModal
        date={value ? new Date(value) : new Date()}
        mode="datetime"
        display="spinner"
        isVisible={this.state.visible}
        onConfirm={this.handleDatePicked}
        onCancel={() => this.showModal(false)}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    );
  }

  render() {
    const {title, value, error, containerStyle, placeholder, editable} =
      this.props;
    const showError = !!(error && error.length > 0);

    let label = title ? (
      <Text style={[styles.label, {marginBottom: 5}]}>{title}</Text>
    ) : null;

    return (
      <View style={containerStyle}>
        {label}
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
            <Text style={{marginLeft: 3, color: 'black'}}>{value}</Text>
          )}
        </TouchableOpacity>
        {showError ? <Text style={styles.error}>{error}</Text> : null}
        {this.renderModal()}
      </View>
    );
  }
}

InputDate.defaultProps = {
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

export default InputDate;
