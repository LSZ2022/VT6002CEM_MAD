import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// 在 src/types.ts 中
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  HelpCenter: undefined;
  Security: undefined;
  About: undefined;
    ChangePassword: undefined;
  Devices: undefined;
  LoginHistory: undefined;
  // 添加其他屏幕...
};

// 为每个屏幕定义导航属性类型
export type RootStackNavigationProp<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};