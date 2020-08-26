var socket = io('http://localhost:2000');

// function dangnhap() {
//     console.log($("#user").val());
//     $('form').submit(function(e) {
//         e.preventDefault();

//     });
// }


socket.on("server-res-login", function(data) {
    // alert('Đăng nhập thành công!');
    $('#currentUser').html(data);

});
socket.on('server-send-list', function(data) {
    $('#listUser').html('');
    data.forEach(function(i) {
        $('#listUser').append('<div class="user">' + i + '</div>');
    });
});
socket.on('server-send-messages', function(data) {
    $('#listMessage').append('<strong>' + data.user + ': </strong>' + data.content + '<br><br>');
});
socket.on('server-send-messages-right', function(data) {
    $('#listMessage').append('<div class="float-right">' + data.content + ' <strong>:' + data.user + '</strong></div><br><br>');
});
socket.on('write', function(data) {
    $('#thongbao').html('<strong>' + data + '</strong>' + '<img src="./images/tenor.gif" width="30" height="30" >');
});
socket.on('Unwrite', function() {
    $('#thongbao').html('');
})
$(document).ready(function() {


    $('#login').click(function() {
        console.log($('#user').val());
        socket.emit('Client-send-login', $('#user').val());

        // $.post('http://localhost:2000/login', { name: $('#user'), password: $('#pass') }, function(res) {
        //     console.log(res);
        // });



    });

    $('#logOut').click(function() {
        socket.emit('logout');
        $('#formDangNhap').show();
        $('#chatForm').hide();

    });
    $('#btnSend').click(function() {

        socket.emit('client-send-messages', $('#txtMessages').val());
        $('#txtMessages').val('');
    });
    $('#txtMessages').focusin(function() {
        socket.emit('dang-go-chu');
    });
    $('#txtMessages').focusout(function() {
        socket.emit('dung-go-chu');
    })
});