(this["webpackJsonpajugi-playlist-webapp"]=this["webpackJsonpajugi-playlist-webapp"]||[]).push([[0],{44:function(e,t,n){e.exports=n(57)},49:function(e,t,n){},57:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(18),i=n.n(r),c=(n(49),n(30)),s=n(2),l=n(39),u=n(75),p=n(74),d=n(76),f=n(28),m=n(38),g=Object(m.a)({palette:{primary:{main:"#ff0022"},secondary:{main:"#22ff00"},error:{main:f.a.A400},background:{default:"#aaa"}}}),h=n(26),v=n(14),b=n.n(v),y=(n(42),n(21)),w=n(41),E=n(32),j="https://api.spotify.com/v1/";function k(e){return O.apply(this,arguments)}function O(){return(O=Object(y.a)(b.a.mark((function e(t){var n,a,o;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.spotifyAccessToken,a=t.url,e.next=3,fetch(a,{headers:{Authorization:"Bearer ".concat(n)}});case 3:return o=e.sent,e.abrupt("return",o.json());case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var A=Object(h.b)({name:"app",initialState:{playlistId:"43m3aAgpbJnoanT48x8ZKI",loading:"idle",pagination:{offset:0,limit:100},view:"songs",songs:[],groupedBy:"",groups:[]},reducers:{setPlaylistId:function(e,t){e.playlistId=t.payload,e.pagination={offset:0,limit:100},e.songs=[]},startLoading:function(e,t){e.loading="loading"},finishLoading:function(e,t){e.loading="loaded"},songsReceived:function(e,t){var n;(n=e.songs).push.apply(n,Object(w.a)(t.payload.items));var a=t.payload,o=a.limit,r=a.offset;e.pagination={limit:o,offset:r}},showArtists:function(e,t){e.groups=Object(E.groupBy)(e.songs,(function(e){var t,n;return null===e||void 0===e||null===(t=e.track)||void 0===t||null===(n=t.artists[0])||void 0===n?void 0:n.id})),e.view="artists"},showAlbums:function(e,t){e.groups=Object(E.groupBy)(e.songs,(function(e){var t,n;return null===e||void 0===e||null===(t=e.track)||void 0===t||null===(n=t.album)||void 0===n?void 0:n.id})),e.view="albums"}}}),I=A.actions,x=A.reducer,B=(I.setPlaylistId,I.startLoading,I.finishLoading,I.songsReceived,I.showArtists,I.showAlbums,x),L=Object(h.a)({reducer:{app:B}}),S=n(40),_={clientId:"6a53c434d5ce4fc2adb439113a5a7ec5",redirectUrl:"https://landscape.cartoonbeats.com/ajugi"};var J=function(){var e="https://accounts.spotify.com/authorize?response_type=token"+"&client_id=".concat(_.clientId)+"&redirect_uri=".concat(_.redirectUrl);return o.a.createElement(o.a.Fragment,null,o.a.createElement("p",null,"Click button to authorise with Spotify."),o.a.createElement("a",{href:e,rel:"noopener noreferrer"},"Authorise"))};var R=function(){for(var e={},t=/([^&;=]+)=?([^&;]*)/g,n=Object(s.f)().hash.substring(1),a=t.exec(n);a;)e[a[1]]=decodeURIComponent(a[2]),a=t.exec(n);return e};var T=function(){var e=R().access_token,t=Object(a.useState)([]),n=Object(S.a)(t,2),r=n[0],i=n[1];return Object(a.useEffect)((function(){r.length>0||!e||k({spotifyAccessToken:e,url:j+"me/playlists"}).then((function(e){console.log(e.items),i(e.items)}))}),[e,r,i]),e?o.a.createElement(o.a.Fragment,null,r.map((function(e){return o.a.createElement("div",{key:e.id},e.name)}))):o.a.createElement(J,null)};var U=function(){return o.a.createElement(p.a,{theme:g},o.a.createElement(u.a,null),o.a.createElement(d.a,null,o.a.createElement(c.a,null,o.a.createElement(l.a,{store:L},o.a.createElement(s.c,null,o.a.createElement(s.a,{path:"/",children:o.a.createElement(T,null)}))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(U,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[44,1,2]]]);
//# sourceMappingURL=main.9365e3f1.chunk.js.map