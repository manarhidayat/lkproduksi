import React, {PureComponent} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../Themes';
import FullButton from './FullButton';
import Input from './Input';
import Spacer from './Spacer';
import Text from './Text';

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
    maxHeight: 500
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});

class ModalMaterialNote extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      item: undefined,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {
    const {setRef} = this.props;
    if (setRef) {
      setRef(this);
    }
  }

  show(item) {
    this.setState({visible: true, item});
  }

  hide() {
    const {onCancel} = this.props;
    this.setState({visible: false}, onCancel);
  }

  render() {
    const {visible, item} = this.state;
    const list = item
      ? item.detailMaterial
        ? item.detailMaterial
        : item.materials
        ? item.materials
        : []
      : [];
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
            <View style={styles.content}>
              <ScrollView>
                {list.length > 0 && (
                  <>
                    <Text style={styles.title}>Material</Text>
                    <Spacer height={10} />
                    {list.map((material) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 10,
                          borderTopWidth: 1,
                          borderColor: Colors.border
                        }}>
                        <Text style={{fontWeight: 'bold', flex: 1}}>
                          {material.pt_desc1}
                        </Text>
                        <Spacer width={10} />
                        <Text>
                          {material.qty_use ||
                            parseInt(material.wocpdm_qty_use, 10)}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
                <Spacer height={20} />
                {item && item.notes && (
                  <>
                    <Text style={styles.title}>Catatan</Text>
                    <Spacer height={10} />
                    <Text style={{fontWeight: 'bold'}}>
                      {item.notes.reason.code_name}
                    </Text>
                    <Text>{item.notes.reasonOther}</Text>
                  </>
                )}
                {item && item.wocpd_reason_desc && (
                  <>
                    <Text style={styles.title}>Catatan</Text>
                    <Spacer height={10} />
                    <Text style={{fontWeight: 'bold'}}>
                      {item.wocpd_reason_desc}
                    </Text>
                    <Text>{item.wocpd_remarks}</Text>
                  </>
                )}
              </ScrollView>

              <View style={styles.bottom}>
                <FullButton
                  onPress={this.hide}
                  style={{width: '100%'}}
                  text="OK"
                />
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

export default ModalMaterialNote;
