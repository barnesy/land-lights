(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"BWX/":function(t,o,n){"use strict";n("v8ht")},iyQ6:function(t,o,n){"use strict";n.r(o);var a={name:"Index",data:function(){return{location:{lat:null,lon:null}}},methods:{askForLocation:function(){var t;console.log(this.location.lat);var o=this;navigator.geolocation.getCurrentPosition((function(n){t=n,o.location.lat=t.coords.latitude,o.location.lon=t.coords.longitude}),(function(t){switch(t.code){case t.TIMEOUT:console.log(t)}}))}}},i=(n("BWX/"),n("KHd+")),e=Object(i.a)(a,(function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("PageSection",{staticClass:"dark",attrs:{bgColor:"var(--red)",bgImage:"url('/img/bg.jpg')"}},[n("Header",{staticClass:"v2",scopedSlots:t._u([{key:"support",fn:function(){return[t._v("\n      "+t._s(t.location.lat+"  "+t.location.lon)+"\n    ")]},proxy:!0}])},[[t._v("\n      HeartbeatATL\n\n      "),n("g-image",{staticClass:"heart",attrs:{src:"/img/heart.png",width:"150",height:"150"},on:{click:t.askForLocation}})]],2)],1)}),[],!1,null,null,null);o.default=e.exports},v8ht:function(t,o,n){}}]);