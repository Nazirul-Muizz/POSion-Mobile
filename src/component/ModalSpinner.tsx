import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

const ModalSpinner = ( {message}: {message: string}) => {
        
    return (
        <Modal>
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>{message}</Text>
                </View>
            </View>
        </Modal>
    );
}

export default ModalSpinner;

const styles = StyleSheet.create({
    overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
})