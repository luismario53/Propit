import './App.css';
import Cards from './components/Cards';
import firebase from 'firebase';
import { firebaseConfig } from './utils/firebase';
// Your web app's Firebase configuration

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


function App() {
  return (
    <div className="App-header">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="HandheldFriendly" content="true" />

      <script src="https://kit.fontawesome.com/2508f54b33.js" crossOrigin="anonymous"></script>
      <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-analytics.js"></script>
      <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js"></script>

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />

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
