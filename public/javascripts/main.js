var socket = io('http://localhost:3001');


socket.emit('start',{user:"user opened page"})
socket.on('news', data=>{
    //updating titles on pagez 
    console.log(data.article); 
    var node = document.createElement("div");                 // Create a <li> node
    node.innerHTML = `${data.article.title} <br><a href=${data.article.link}>${data.article.link}</a>`;
    node.classList.add('article');
    document.querySelector('.newsArea').appendChild(node);
})