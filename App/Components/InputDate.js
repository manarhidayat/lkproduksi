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
    const {mode} = this.props;
    this.showModal(false);

    let format = 'YYYY-MM-DD HH:mm';
    if (mode === 'date') {
      format = 'YYYY-MM-DD';
    } else if (mode === 'time') {
      format = 'HH:mm';
    }
    this.props.onSelect(Moment(date).format(format));
  }

  showModal(visible) {
    const {notEditable} = this.props;
    if (!notEditable) {
      this.setState({visible});
    }
  }

  renderModal() {
    const {value, minimumDate, maximumDate, mode} = this.props;

    return (
      <DateTimePickerModal
        date={value ? new Date(value) : new Date()}
        mode={mode || 'datetime'}
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
    const {title, value, error, containerStyle, placeholder, editable, mode} =
      this.props;
    const showError = !!(error && error.length > 0);

    let label = title ? (
      <Text style={[styles.label, {marginBottom: 5}]}>{title}</Text>
    ) : null;

    const isValid = value && value !== undefined && value !== '';

    let format = 'YYYY-MM-DD HH:mm';
    if (mode === 'date') {
      format = 'YYYY-MM-DD';
    } else if (mode === 'time') {
      format = 'HH:mm';
    }
    const text = isValid ? Moment(value).format(format) : '';

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
            <Text style={{marginLeft: 3, color: 'black'}}>{text}</Text>
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
