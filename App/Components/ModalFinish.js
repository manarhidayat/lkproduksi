import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../Themes';
import FullButton from './FullButton';
import Input from './Input';
import Spacer from './Spacer';
import Text from './Text';
import OperationActions, {OperationSelectors} from '../Redux/OperationRedux';

const styles = StyleSheet.create({
  modalContainer: {},
  container: {
    backgroundColor: Colors.snow,
    padding: 16,
    borderRadius: 8,
  },
  bottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    justifyContent: 'center',
    maxHeight: 600,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  titleLabel: {
    fontWeight: '600',
    marginBottom: 10,
  },
  heightField: {
    height: 50,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: Colors.greyLight,
  },
  heightInput: {
    height: 18,
    marginTop: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLabel: {
    flex: 1,
  },
  inputPlan: {
    flex: 0.5,
  },
  inputActual: {
    flex: 0.5,
  },
  textTitle: {fontWeight: 'bold'},
  titleContainer: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderColor: 'grey',
  },
});

const schema = Yup.object().shape({
  gasMeter: Yup.string().required('Mohon Masukan Gas Meter'),
  // jumlahProduksi: Yup.string().required('Mohon Masukan Jumlah Produksi'),
});

class ModalFinish extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.isVisible = this.isVisible.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  componentDidMount() {
    const {setRef} = this.props;
    if (setRef) {
      setRef(this);
    }
  }

  isVisible() {
    return this.state.visible;
  }

  show() {
    this.setState({visible: true});
  }

  hide() {
    const {onCancel} = this.props;
    this.setState({visible: false}, onCancel);
  }

  handleSubmit(values) {
    const {gasMeter, jumlahProduksi} = values;
    const {onDone} = this.props;

    const {finishMaterial, setFinishMaterial} = this.props;
    let validated = true;

    let detailMaterial = [];
    finishMaterial.map((item) => {
      // if (values[item.pt_code] < 0) {
      //   Alert.alert('Peringatan', 'Actual tidak boleh kurang dari 0');
      //   validated = false;
      //   return;
      // }
      detailMaterial.push({
        ...item,
        material_id: item.pt_id,
        qty_open: `${item.wop_qty_open}`,
        qty_use: values[item.pt_code] || '0',
      });
    });

    if (!validated) {
      return;
    }

    setFinishMaterial(detailMaterial);

    setTimeout(() => {
      this.setState({visible: false}, () => onDone(gasMeter));
    }, 300);
  }

  renderForm(props) {
    const {finishMaterial} = this.props;
    return (
      <View style={styles.content}>
        <Text style={styles.title}>Masukan Gas Meter & Material</Text>
        <Spacer height={10} />
        <Input
          placeholder="Gas Meter"
          name="gasMeter"
          keyboardType="number-pad"
          value={props.values.gasMeter}
          error={props.errors.gasMeter}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        />
        {/* <Input
          placeholder="Jumlah Produksi"
          name="jumlahProduksi"
          keyboardType="number-pad"
          value={props.values.jumlahProduksi}
          error={props.errors.jumlahProduksi}
          setFieldValue={props.setFieldValue}
          setFieldTouched={() => {}}
        /> */}
        {/* <ScrollView>
          <View style={styles.content}>
            {finishMaterial.length > 0 && (
              <View style={[styles.row, styles.titleContainer]}>
                <Text style={[styles.textTitle, {flex: 1}]}>Material</Text>
                <Text style={[styles.textTitle, {flex: 0.5}]} />
              </View>
            )}
            {finishMaterial.map((item) => {
              return (
                <View style={styles.row}>
                  <Text style={styles.textLabel}>{item.pt_desc1}</Text>
                  <Spacer width={10} />
                  <Input
                    placeholder=" "
                    name={item.pt_code}
                    keyboardType="number-pad"
                    containerStyle={styles.inputActual}
                    value={props.values[item.pt_code]}
                    error={props.errors[item.pt_code]}
                    setFieldValue={props.setFieldValue}
                    setFieldTouched={() => {}}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView> */}

        <View style={styles.bottom}>
          <FullButton
            onPress={this.hide}
            style={{
              width: '45%',
              backgroundColor: Colors.button,
              borderWidth: 1,
            }}
            text="BATAL"
            textStyle={{color: 'black'}}
          />
          <Spacer width={20} />
          <FullButton
            onPress={(e) => {
              props.handleSubmit(e);
            }}
            style={{width: '45%'}}
            text="SIMPAN"
          />
        </View>
      </View>
    );
  }

  render() {
    const {visible} = this.state;
    const {finishMaterial} = this.props;
    return (
      <>
        <Modal
          isVisible={visible}
          onBackdropPress={this.hide}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackButtonPress={this.hide}
          backdropTransitionOutTiming={0}
          style={styles.modalContainer}>
          <View style={styles.container}>
            <Formik
              onSubmit={this.handleSubmit}
              validationSchema={schema}
              render={this.renderForm}
            />
          </View>
        </Modal>
      </>
    );
  }
}

const selector = createSelector(
  [OperationSelectors.getFinishMaterial],
  (finishMaterial) => ({
    finishMaterial,
  })
);

const mapStateToProps = (state) => selector(state);

const mapDispatchToProps = (dispatch) => ({
  setFinishMaterial: (params) =>
    dispatch(OperationActions.setFinishMaterial(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalFinish);
