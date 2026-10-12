import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import ThemeProvider from './src/constants/ThemeProvider'
import ThemeWrapper from './src/constants/ThemeWrapper'
import Router from './src/navigation/Routes'
import "./src/Utlies/ignoreWarnings";
import NetworkProvider from './src/context/NetworkProvider'
import { DialogProvider } from './src/context/DialogContext'
import { AppSettingProvider } from './src/context/AppSettingContext'
import { LanguageProvider } from './src/context/LanguageContext'

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemeWrapper>
          <NetworkProvider>
            <AppSettingProvider>
              <LanguageProvider>
                <DialogProvider>
                  <Router />
                </DialogProvider>
              </LanguageProvider>
            </AppSettingProvider>
          </NetworkProvider>
        </ThemeWrapper>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

export default App 
