import './App.css';
import Cards from './components/Cards';
import firebase from 'firebase';
import { firebaseConfig } from './utils/firebase';
// Your web app's Firebase configuration

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


function App() {
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossOrigin="anonymous"
      />
      <Cards />
    </div>
  );
}

export default App;
