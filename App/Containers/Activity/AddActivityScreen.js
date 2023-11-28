import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import {createSelector} from 'reselect';

import Button from '../../Components/FullButton';
import Input from '../../Components/Input';
import InputSelect from '../../Components/InputSelect';
import InputDate from '../../Components/InputDate';
import ActivityActions, {ActivitySelectors} from '../../Redux/ActivityRedux';
import NavigationServices from '../../Navigation/NavigationServices';
import {JENIS_OPERASI} from '../../Lib/Constans';
import ButtonWhite from '../../Components/ButtonWhite';
import RadioButton from '../../Components/RadioButton';
import {SessionSelectors} from '../../Redux/SessionRedux';
import {SupportToolsSelectors} from '../../Redux/SupportToolsRedux';

const schema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Mohon masukan format Email dengan benar')
  //   .required('Mohon lengkapi Email Anda'),
  // password: Yup.string()
  //   .min(6, 'Min 6 Karakter')
  //   .required('Mohon lengkapi Kata Sandi Anda')
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16
  }
});

class AddActivityScreen extends Component {
  constructor(props) {
    super(props);
    const {route} = props;
    const activity = route?.params?.activity;
    this.state = {
      isCompleted: activity ? activity.isComplete : false,
      isUpload: activity ? activity.isUpload : false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.onPressDelete = this.onPressDelete.bind(this);
  }

  postActivity(activity) {
    const {postActivityRequest, machine, supportTools, location} = this.props;

    if (activity && activity.isComplete) {
      const params = {
        name: activity.name,
        machine_id: machine.id,
        location_id: location.id,
        desc: activity.desc,
        start: `${activity.start_date}:00`,
        end: `${activity.end_date}:00`,
        type: activity.operasi.name,
        items: supportTools
          ? supportTools.map((item) => {
              return {
                active_id: item.inventory.id,
                used: item.jumlah,
              };
            })
          : []
      };
      postActivityRequest({params, activity});
    }
  }

  onPressDelete() {
    const {route, deleteActivity} = this.props;
    const activity = route?.params?.activity;

    deleteActivity(activity.id);
    NavigationServices.pop();
  }

  handleSubmit(values) {
    const {route, saveActivity, editActivity, user, location} = this.props;
    const {isCompleted} = this.state;
    const isEdit = route?.params?.isEdit;
    const activity = route?.params?.activity;
    const {name, desc, start_date, end_date, operasi} = values;

    let params = {
      name,
      desc,
      operasi,
      location: location.id,
      start_date,
      end_date,
      isComplete: isCompleted,
      isUpload: false,
      isDelete: false,
    };

    if (isEdit) {
      params = {
        ...params,
        id: activity.id
      };
      // editActivity(params);
    } else {
      params = {
        ...params,
        id: uuid.v4()
      };
      saveActivity(params);
    }
    NavigationServices.pop();

    this.postActivity(params);
  }

  renderForm(props) {
    const {route, locations} = this.props;
    const isEdit = route?.params?.isEdit;
    const {isCompleted, isUpload} = this.state;

    return (
      <View style={styles.content}>
        <Input
          placeholder="Name"
          name="name"
          editable={!isUpload}
          value={props.values.name}
          error={props.errors.name}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <Input
          placeholder="Description"
          name="desc"
          editable={!isUpload}
          style={{height: 100, textAlignVertical: 'top'}}
          value={props.values.desc}
          error={props.errors.desc}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        <InputSelect
          name="operasi"
          placeholder="Operation"
          editable={!isUpload}
          data={JENIS_OPERASI}
          value={
            props.values.operasi
              ? props.values.operasi.name
              : props.values.operasi
          }
          error={props.errors.operasi}
          onSelect={(item) => {
            props.setFieldValue('operasi', item);
          }}
        />
        {/* <InputSelect
          name="location"
          placeholder="Location"
          editable={!isUpload}
          data={locations}
          value={
            props.values.location
              ? props.values.location.name
              : props.values.location
          }
          error={props.errors.location}
          onSelect={(item) => {
            props.setFieldValue('location', item);
          }}
        /> */}
        <InputDate
          title="Start Date"
          name="start_date"
          editable={!isUpload}
          pointerEvents="none"
          // editable={false}
          selectTextOnFocus={false}
          value={props.values.start_date}
          error={props.errors.start_date}
          onSelect={(item) => {
            props.setFieldValue('start_date', item);
          }}
          setFieldTouched={() => {}}
          maximumDate={
            props.values.end_date ? new Date(props.values.end_date) : undefined
          }
        />
        <InputDate
          title="End Date"
          name="end_date"
          editable={!isUpload}
          pointerEvents="none"
          // editable={false}
          selectTextOnFocus={false}
          value={props.values.end_date}
          error={props.errors.end_date}
          onSelect={(item) => {
            props.setFieldValue('end_date', item);
          }}
          setFieldTouched={() => {}}
          minimumDate={
            props.values.start_date
              ? new Date(props.values.start_date)
              : undefined
          }
        />

        {isEdit && !isUpload && (
          <RadioButton
            text={'Completed?'}
            checked={isCompleted}
            textOnRight
            onPress={() => this.setState({isCompleted: !isCompleted})}
          />
        )}

        {!isUpload && (
          <Button
            onPress={(e) => {
              props.handleSubmit(e);
            }}
            style={{marginTop: 40}}
            text={isEdit ? 'UPDATE' : 'CREATE'}
          />
        )}

        {isEdit && !isUpload && (
          <ButtonWhite
            onPress={this.onPressDelete}
            text="DELETE"
            style={{marginTop: 10, borderColor: 'red'}}
            textStyle={{color: 'red'}}
          />
        )}
      </View>
    );
  }

  render() {
    const {route, activitiesNotUploaded} = this.props;
    const activity = route?.params?.activity;
    const isEdit = route?.params?.isEdit;

    return (
      <SafeAreaView style={styles.container}>
        <Formik
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={this.renderForm}
          // validateOnChange={false}
          initialValues={{
            name: isEdit ? activity.name : '',
            desc: isEdit ? activity.desc : '',
            operasi: isEdit ? activity.operasi : {},
            // location: isEdit ? activity.location : {},
            start_date: isEdit ? activity.start_date : '',
            end_date: isEdit ? activity.end_date : ''
          }}
        />
      </SafeAreaView>
    );
  }
}

const selector = createSelector(
  [
    SessionSelectors.selectUser,
    ActivitySelectors.getLocations,
    SessionSelectors.selectMachine,
    ActivitySelectors.getActivitieNotUploaded,
    SessionSelectors.selectLocation
  ],
  (user, locations, machine, activitiesNotUploaded, location) => {
    return {
      user,
      locations,
      machine,
      activitiesNotUploaded,
      location,
    };
  }
);

const selectorSupportTools = createSelector(
  [SupportToolsSelectors.getListSupportTools],
  (supportTools) => ({
    supportTools,
  })
);

const mapStateToProps = (state, props) => {
  const activity = props?.route?.params?.activity;
  let supportTools = activity ? selectorSupportTools(state, activity.id) : [];

  return {
    ...selector(state),
    ...supportTools
  };
};

const mapDispatchToProps = (dispatch) => ({
  saveActivity: (params) => dispatch(ActivityActions.saveActivity(params)),
  editActivity: (params) => dispatch(ActivityActions.editActivity(params)),
  deleteActivity: (params) => dispatch(ActivityActions.deleteActivity(params)),

  postActivityRequest: (params) =>
    dispatch(ActivityActions.postActivityRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddActivityScreen);
