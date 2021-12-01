import '../../component-library/lib/assets/styles/global.scss';

import NavList from "./components/NavList";
import Logo from "./components/Logo";
import FooterLogo from "./components/FooterLogo";
import FooterLeft from "./components/FooterLeft";
import FooterNavList from "./components/FooterNavList";

import {  Button,
          Card,
          CardGroup,
          Directory,
          PageSection,
          Split,
          Header,
          PullQuote,
          GridItem,
          GridRow,
          Navigation,
          Footer,
       }
from '../../component-library';

export default function(Vue, { router, head, isClient }) {

  Vue.component('Logo', Logo);
  Vue.component('NavList', NavList);
  Vue.component('FooterLogo', FooterLogo);
  Vue.component('FooterNavList', FooterNavList);
  Vue.component('FooterLeft', FooterLeft);

  Vue.component('Button', Button);
  Vue.component('Navigation', Navigation);
  Vue.component('Logo', Logo);
  Vue.component('Card', Card);
  Vue.component('CardGroup', CardGroup);
  Vue.component('Split', Split);
  Vue.component('Header', Header);
  Vue.component('PullQuote', PullQuote);
  Vue.component('GridItem', GridItem);
  Vue.component('GridRow', GridRow);
  Vue.component('Directory', Directory);
  Vue.component('PageSection', PageSection);
  Vue.component('Footer', Footer);
}

import Vue from 'vue';
import socketio from 'socket.io';
import VueSocketIO from 'vue-socket.io';

export const SocketInstance = socketio('http://localhost:4113');

Vue.use(VueSocketIO, SocketInstance)