import './App.css'
// routers
import { RouterProvider } from 'react-router-dom'
import { routers_definitions } from './routers/index.jsx';

function App() {
  return <RouterProvider router={routers_definitions} />;
}

export default App;
