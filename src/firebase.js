import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: 'AIzaSyC-Z9zzadADFZy1k3XJEdCr-MdqhAjiCc0',
  authDomain: 'reactapp-a7e63.firebaseapp.com',
  databaseURL: 'https://reactapp-a7e63.firebaseio.com',
  projectId: 'reactapp-a7e63',
  storageBucket: 'reactapp-a7e63.appspot.com',
  messagingSenderId: '50647145040',
  appId: '1:50647145040:web:9cd779ba3c6c5676ca4f55',
  measurementId: 'G-4S5B2CLBH8',
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    //Referenciando a database para acessar em outros locais
    this.app = app.database();
    this.storage = app.storage();
  }

  login(email, password) {
    return app.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    return app.auth().signOut();
  }

  async register(nome, email, password) {
    await app.auth().createUserWithEmailAndPassword(email, password);

    const uid = app.auth().currentUser.uid;

    return app.database().ref('usuarios').child(uid).set({
      nome: nome,
    });
  }

  isInitialized() {
    return new Promise((resolve) => {
      app.auth().onAuthStateChanged(resolve);
    });
  }

  getCurrent() {
    return app.auth().currentUser && app.auth().currentUser.email;
  }

  getCurrentUid() {
    return app.auth().currentUser && app.auth().currentUser.uid;
  }

  async getUserName(callback) {
    if (!app.auth().currentUser) {
      return null;
    }

    const uid = app.auth().currentUser.uid;

    await app
      .database()
      .ref('usuarios')
      .child(uid)
      .once('value')
      .then(callback);
  }
}

export default new Firebase();
