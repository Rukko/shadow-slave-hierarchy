import { render } from 'preact';
import './styles/main.css';
import { App } from './components/App';

render(<App />, document.getElementById('app') as HTMLElement);
