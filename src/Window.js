import React from 'react';

import { ThemeProvider, createTheme, loadTheme } from '@fluentui/react';

import themes from './Themes';

export default class extends React.Component {

    static defaultProps = {
        radius: '8px',
    };

    constructor(props) {
        super(props);
        this.state = { currentThemeName: getThemeName() };
        this.updateTheme = this.updateTheme.bind(this);

        // Load theme globally
        loadTheme(createTheme(themes[this.state.currentThemeName]));
    }

    updateTheme(themeName) {
        this.setState({ currentThemeName: themeName });

        // Load theme globally
        loadTheme(createTheme(themes[this.state.currentThemeName]));
    }

    componentDidMount() {
        /* Update the theme when the theme to display changes */
        themeSys.eventSystem.on('update', themeName => this.updateTheme(themeName));
    }

    render() {

        const theme = themes[this.state.currentThemeName];

        return (

            <ThemeProvider theme={theme}>
                <div style={{
                    background: theme.background,
                    border: `1px solid ${theme.palette.neutralLight}`,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: -100,
                    borderRadius: this.props.radius,
                    boxSizing: 'border-box'
                }}>

                    {this.props.children}

                </div>
            </ThemeProvider>

        );
    }
}

