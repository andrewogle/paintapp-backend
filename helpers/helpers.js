module.exports = {
    
generateId : (len)=> {
    let result = "";
    for(let i = 0; i < len; i ++) {
       result += Math.floor(Math.random() * 10);
    }
    return result;
  },
  countDown : ()=>{
    setInterval((sessions) => {
        for(sessionKey in sessions) {
          const session = sessions[sessionKey];
          session.decrementTimer();
          if(session.getTimer() === 0) {
            delete sessions[sessionKey];
          }
        }
      }, 1000);
  }
}