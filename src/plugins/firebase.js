import Vue from 'vue';
import firebase from "firebase/app";


import "firebase/auth";
import "firebase/firestore";
import 'firebase/firebase-database';

import firebaseConfig from '../../firebaseConfig';

import store from '../store';

firebase.initializeApp(firebaseConfig);

Vue.prototype.$firebase = firebase;

store.dispatch('user/AuthAction', firebase);
