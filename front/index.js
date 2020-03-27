var user = {
    username: null,
    color: null
}
var ws = null;
$(function () {
    check_for_username();
    $('.login').on('click', function(e){
        let username = $('input[id=id_websocket_username]').val();
        if (username.length != 0) {
            localStorage.setItem('aiousername', username);
            $('input[id=id_websocket_username]');
            check_for_username();
            prepare_chat();
        }
    });
    $('.form').on('click', '.chat', function (e) {
        let data = $('input[id=id_websocket_speaker]');
        ws.send(JSON.stringify({
            user: localStorage.getItem('aiousername'),
            message: data.val(),
            color: user.color
        }));
        data.val('');
    });
    $('.form').on('click', '#change-color', function(e){
        user.color = `rgb(${rand()}, ${rand()}, ${rand()})`;
        check_for_username();
    });
    $('.form').on('click', '#clear-history', function(e){
        $(".answer").html('');
    })
});

function check_for_username(){
    if(!localStorage.getItem('aiousername')) {
        $('.form').html(`
            <div class="login-form">
                <label for="id_websocket_username">ENTER YOUR USERNAME</label><br>
                <input id="id_websocket_username"><br>
                <button class="login">SUBMIT</button>
            </div>
        `);
    } else {
        prepare_chat();
        $('.form').html(`
            <div class="message-form">
                <input id="id_websocket_speaker">
                <button class="btn btn-success mt-2 chat">SUBMIT</button>
            </div>
        `);
    }
}

function prepare_chat(){
    user.username = localStorage.getItem('aiousername');
    user.color = `rgb(${rand()}, ${rand()}, ${rand()})`;
    if(!ws){
	let host = location.host
        ws = new WebSocket('ws://'+host+':8080/ws');
    }
    ws.onmessage = function(msg) {
        let data = JSON.parse(msg.data);
        html = `
        <div class="message">
            <h1 class="text-success" style="color: ${data.color}">
             <b>${data.user} ${data.user == user.username? "(you)": ''}:</b><br/>${data.message}</h1>
        </div>
        `;
        $('.answer').prepend(html)
    };
    ws.onclose = function () {
        $('.answer').html(`
            <h1 class="text-danger">Connection closed</h1>
        `)
    }
}

addEventListener('keydown', function(e){
    if (e.keyCode == 13) {
        $('button').click();
    }
})

function rand() {
    let rand_num = Math.floor((Math.random() * 255));
    return rand_num
}
