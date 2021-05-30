/**
 * @file Catches exceptions and displays a user-friendly error screen.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  Stack,
  Text,
  ActionButton, PrimaryButton
} from '@fluentui/react'

import Window from './Container'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI.
    console.log(error)
    return { hasError: true }
  }

  // componentDidCatch (error, errorInfo) {
  //   // You can also log the error to an error reporting service
  // }

  handleReset () {
    store.reset()
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Window>

          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          >

            <Stack tokens={{ childrenGap: 24 }}>

              <Stack.Item align='center'>
                <Text variant='xxLarge' align='center'>
                  Sorry, something went wrong.
                </Text>
              </Stack.Item>

              <Stack.Item align='center'>
                <PrimaryButton
                  iconProps={{ iconName: 'Refresh' }}
                  text='Restart app'
                  onClick={restartApp}
                />
              </Stack.Item>

            </Stack>

          </div>

          <div style={{
            position: 'absolute',
            left: '50%',
            top: '90%',
            transform: 'translate(-50%, -50%)'
          }}
          >
            <ActionButton
              iconProps={{ iconName: 'Refresh' }}
              text={`Reset ${aboutAppInfo.appInfo.name} if you are still having trouble`}
              onClick={this.handleReset}
            />
          </div>

        </Window>

      )
    }

    return this.props.children
  }
}