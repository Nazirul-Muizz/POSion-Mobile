import { ActivityIndicator, Modal, Text, View } from 'react-native';

const ModalSpinner = ( {message}: {message: string}) => {
        
    return (
        <Modal>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>{message}</Text>
            </View>
        </Modal>
    );
}

export default ModalSpinner;