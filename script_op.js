// Generate random Myroom name if needed
if (!location.hash) {
  //location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  location.hash = 11111;
}
const Hash = location.hash.substring(1);

// TODO: Replace with your own channel ID
const scale = new Scaledrone('i0QUyybS6IyjZK2X');
// Myroom name needs to be prefixed with 'observable-'
const nameMyroom = 'observable-' + Hash;
const config = {
  iceServers: [
  {
	  urls: 'stun:stun.l.google.com:19302'
	
}



  ]
};
const pc_constraints = {"optional": [{"DtlsSrtpKeyAgreement": true}]};
let Myroom;
let RTC_Peer;

function hashGen(len) {
    charHash = '123456789';
    var strHash = '';
    for (var i = 0; i < len; i++) {
        var pos = Math.floor(Math.random() * charHash.length);
        strHash += charHash.substring(pos,pos+1);
    }
    return strHash;
}
		

function onSuccess() {
  
};
function onFail(error) {
  console.error(error);
};

scale.on('open', error => {
  if (error) {
    return console.error(error);
  }
  Myroom = scale.subscribe(nameMyroom);
  Myroom.on('open', error => {
    if (error) {
      onFail(error);
    }
  });

  Myroom.on('members', party  => {
    console.log('MEMBERS', party );
   
    const isProposition = party .length === 2;
    startWebRTC(isProposition);
  });
});


function sendMes(message) {
  scale.publish({
    room: nameMyroom,
    message
  });
}


var VideoAudio = { audio: true, video: true };
var audio = new Audio('sound.mp3');
function startWebRTC(isProposition) {
	
	Myroom = scale.subscribe(nameMyroom);
Myroom.on('data', message => {
    console.log('Received message', message);
    $('.chat').html(message);
  });
  
  

  RTC_Peer = new RTCPeerConnection(config);
  



console.log('RTC_Peer', RTC_Peer);

  RTC_Peer.onicecandidate = event => {
    audio.play();
    if (event.candidate) {
      sendMes({'candidate': event.candidate});
    }
  };


  if (isProposition) {
    RTC_Peer.onnegotiationneeded = () => {
      RTC_Peer.createOffer().then(localDesc).catch(onFail);
    }
  }


  RTC_Peer.ontrack = event => {
    const flow = event.streams[0];
    if (!distantVideo.srcObject || distantVideo.srcObject.id !== flow.id) {
      distantVideo.srcObject = flow;
    }
  };

  navigator.mediaDevices.getUserMedia(VideoAudio).then(stream => {
   stream.getTracks().forEach(track => RTC_Peer.addTrack(track, stream));
    My_Video.srcObject = stream;
    
    
  }, onFail);

  
  Myroom.on('data', (message, client) => {
   
    if (client.id === scale.clientId) {
      return;
    }

    if (message.sdp) {
      
      RTC_Peer.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
       
        if (RTC_Peer.remoteDescription.type === 'offer') {
          RTC_Peer.createAnswer().then(localDesc).catch(onFail);
        }
      }, onFail);
    } else if (message.candidate) {
    
      RTC_Peer.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onFail
      );
    }
  });
}
//document.writeln('<br><br><br><br>');
//document.writeln('https://robott.site/#'+MyroomHash);
function localDesc(desc) {
  RTC_Peer.setLocalDescription(
    desc,
    () => sendMes({'sdp': RTC_Peer.localDescription}),
    onFail
  );
}

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }
  
  