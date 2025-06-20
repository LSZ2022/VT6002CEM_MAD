// src/types/biometrics.d.ts
declare module 'react-native-biometrics' {
  interface IsSensorAvailableResult {
    [x: string]: SetStateAction<boolean>;
    available: boolean;
    biometryType?: 'TouchID' | 'FaceID' | 'Biometrics';
  }

  interface SimplePromptResult {
    success: boolean;
  }

  const Biometrics: {
    [x: string]: any;
    isSensorAvailable(): Promise<IsSensorAvailableResult>;
    simplePrompt(options: {
      promptMessage: string;
      cancelButtonText?: string;
    }): Promise<SimplePromptResult>;
  };

  export default Biometrics;
}