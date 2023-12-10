import { Container } from 'react-bootstrap'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import { useContext } from 'react';
import Header from './components/Header.js'
import HomeScreen from './screens/HomeScreen';
// import TestPage from './screens/TestPage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen.js';
import MainScreen from './screens/Mainscreen.js';
import TestScreen from './screens/TestScreen.js';
import ResultScreen from './screens/ResultScreen.js';
import Testcode from './screens/Testcode.js';

function App() {
  return (
    <Router>
      <Header/>
       <Container>
       <Routes>
       <Route path='/' element={<HomeScreen />} />
       <Route path='/login' element={<LoginScreen />} />
       <Route path='/register' element={<RegisterScreen />} />
       <Route path='/main' element={<MainScreen />} />
       <Route path='/test/:id' element={<TestScreen />} />
       <Route path='/testcode' element={<Testcode />} />
       <Route path='/result' element={<ResultScreen />} />
       </Routes>
       </Container>
    </Router>
  );
}

export default App;
