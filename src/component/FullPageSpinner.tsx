import { ActivityIndicator, Text, View } from 'react-native';

const FullPageSpinner = ( {message}: {message: string}) => {
        
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{message}</Text>
        </View>
    );
}

export default FullPageSpinner;