import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
    }

    static getDerivedStateFromError(error) {
        return { error: true };
    }

    render() {
        if (this.state.error) {
            return <h1>Something has gone wrong..</h1>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;