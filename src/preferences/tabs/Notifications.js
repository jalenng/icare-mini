/**
 * @file The "About" tab in Preferences
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  IconButton,
  Dropdown, DropdownMenuItemType,
  Slider,
  Stack,
  Text,
  Toggle,
  TooltipHost
} from '@fluentui/react'

import { StackProps } from '../../SharedProps'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      notifications: store.preferences.getAll().notifications,
      sounds: store.sounds.getAll()
    }
  };

  componentDidMount () {
    // Update this component's state when preferences are updated
    store.preferences.eventSystem.on('changed', () => {
      this.updateState()
    })

    store.sounds.eventSystem.on('changed', () => {
      this.updateState()
    })
  };

  updateState () {
    this.setState({
      notifications: store.preferences.getAll().notifications,
      sounds: store.sounds.getAll()
    })
  };

  handleAddSound () {
    store.sounds.add()
  }

  render () {
    const defaultSoundsHeader = [{
      key: 'defaultSoundsHeader',
      text: 'Default',
      itemType: DropdownMenuItemType.Header
    }]
    const customSoundsHeader = [{
      key: 'customSoundsHeader',
      text: 'Custom',
      itemType: DropdownMenuItemType.Header
    }]

    const divider = [{
      key: 'div',
      text: '-',
      itemType: DropdownMenuItemType.Divider
    }]

    const defaultSounds = this.state.sounds.defaultSounds
    const customSounds = this.state.sounds.customSounds

    const combinedSoundList =
      defaultSoundsHeader
        .concat(defaultSounds)
        .concat(divider)
        .concat(customSoundsHeader)
        .concat(customSounds)

    return (

      <Stack id='notifications' {...StackProps.level1}>

        <Stack {...StackProps.level2}>
          <Text variant='xLarge' block> Timing </Text>

          <Slider
            id='notifSlider'
            label='Notification interval'
            min={5} max={60} step={5}
            showValue snapToStep
            valueFormat={(number) => `${number} minutes`}
            styles={{ root: { maxWidth: 300 } }}
            value={this.state.notifications.interval}
            onChange={number => store.preferences.set('notifications.interval', number)}
          />
        </Stack>

        <Stack {...StackProps.level2}>
          <Text variant='xLarge' block> Sound </Text>

          <Toggle
            id='soundNotifsToggle'
            label='Enable sound'
            onText='On' offText='Off'
            checked={this.state.notifications.enableSound}
            onChange={(event, checked) => store.preferences.set('notifications.enableSound', checked)}
          />

          <Stack {...StackProps.level2Horizontal} verticalAlign='end'>

            <Dropdown
              label='Sound selection'
              id='soundDropdown'
              styles={{ dropdown: { width: 300 } }}
              selectedKey={this.state.notifications.sound}
              options={combinedSoundList}
              onChange={(event, option, index) => {
                store.preferences.set('notifications.sound', combinedSoundList[index].key)
              }}
            />

            <TooltipHost content='Preview'>
              <IconButton
                id='playSoundBtn'
                iconProps={{ iconName: 'Play' }}
                onClick={playSound}
              />
            </TooltipHost>

            <TooltipHost content='Import'>
              <IconButton
                iconProps={{ iconName: 'Add' }}
                onClick={this.handleAddSound}
              />
            </TooltipHost>

          </Stack>

          <Slider
            label='Volume'
            min={0} max={100} step={1}
            showValue snapToStep
            valueFormat={(number) => `${number}%`}
            styles={{ root: { maxWidth: 300 } }}
            value={this.state.notifications.soundVolume}
            onChange={number => store.preferences.set('notifications.soundVolume', number)}
          />

        </Stack>

      </Stack>
    )
  }
}
