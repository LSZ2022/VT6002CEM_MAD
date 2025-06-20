import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 1. 定義導航參數類型
type RootParamList = {
    Welcome: undefined;
    Login: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
    RootParamList,
    'Welcome'
>;

const WelcomePage = () => {
    // 2. 指定具體類型
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login'); // 不再報錯
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ImageBackground source={require('../assets/wallpaper.png')} resizeMode={'cover'} style={{ flex: 1 }}>
            <View style={styles.content}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Welcome to CompanyPortal</Text>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 3,
    },
    buttonText: {
        color: '#3b5998',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default WelcomePage;