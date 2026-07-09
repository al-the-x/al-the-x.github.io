import {
  Component,
  html
} from 'https://unpkg.com/htm@3.1.1/preact/standalone.module.js';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Spirit level application error', error, errorInfo);

    const shouldReset = window.confirm('The application encountered an error. Reset now?');

    if (shouldReset) {
      window.location.reload();
      return;
    }

    this.setState({
      hasError: true,
      error
    });
  }

  render({ children }, { hasError, error }) {
    if (hasError) {
      return html`<p id="level-status">${error?.message || 'An unexpected error occurred.'}</p>`;
    }

    return children;
  }
}
