import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PopupProps = {
    visible: boolean,
    onConfirm: () => void,
    onCancel: () => void,
    title?: string,
    children?: React.ReactNode
}

const ConfigPopup = ({
    visible,
    onConfirm,
    onCancel,
    title,
    children
}: PopupProps) => {
  return (
    <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={onCancel}
    >
        <View style={ styles.overlay }>

            <View style={ styles.modalBox }>

                <Text style={ styles.modalTitle}>{title}</Text>

                {children}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={onCancel}
                        style={[styles.button, styles.cancelButton]}
                    >
                        <Text style={styles.buttonText}>Batal</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity
                        onPress={onConfirm}
                        style={[styles.button, styles.confirmButton]}
                    >
                        <Text style={styles.buttonText}>Pasti</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>

    </Modal>
  )
}

export default ConfigPopup

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
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10,
        color: 'black' 
    },
    modalBody: {

    },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10, padding:10, gap: 5 },
    button: {borderRadius: 8, marginLeft: 10, padding: 10 },
    cancelButton: { backgroundColor: '#e53935' },
    confirmButton: { backgroundColor: '#4CAF50' },
    buttonText: { color: '#fff', fontSize: 13 },

})