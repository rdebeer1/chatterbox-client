var app = {
  server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
  currentRoom: 'lobby',
  context: this,
  friends: {},
  messages: [],
  messagesShown: 0,
  username: undefined,
  friendsHidden: false,

  init: () => {
    $('#post').click(() => {
      $('.overlay').slideToggle();
    });
    $('#message-form').submit((e) => {
      e.preventDefault();
      app.username = $('#username').val();

      let message = {
        username: app.username,
        text: $('#message-box').val(),
        roomname: app.currentRoom
      };
      
      app.handleSubmit(message);

      setTimeout(() => {
        $('.overlay').slideToggle();
        $('#message-box').val('');
      }, 1000);
    });
    $('#new').click(() => {
      app.fetch();
      $('#display').text('Alerts');
    });
    $('#clear').click(() => {
      app.clearMessages();
    });
    $('#add-room').click(() => {
      if ($('#new-room').val()) {
        app.renderRoom($('#new-room').val());
      }
      $('#new-room').val('');
    });
    $('#roomSelect').on('change', () => {
      app.showRooms($('#roomSelect').val());
    });
    $('#chats').on('click', '.username', (e) => {
      app.handleUsernameClick($(e.target).text());
    });
  },

  fetch: () => {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {order: '-createdAt', limit: '50'},
      success: (data) => {
        var posts = data.results;
        for (let i = 0; i < posts.length; i++) {
          app.messages.push(posts[i]);
          var message = posts[i];
          app.renderMessage(message);
        }
      }
    });
  },

  send: message => {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      success: () => {
        $('#message-box').val('Message sent!');
      },
      error: () => {
        $('#message-box').val('Message sent!');
      }
    });
  },
  
  renderMessage: message => {
    var currentUsername = _.escape(message.username) || 'MALICIOUS USERNAME BLOCKED';
    var room = _.escape(message.roomname) || 'lobby';
    var message = _.escape(message.text) || 'MALICIOUS MESSAGE BLOCKED';
    $('#chats').append(`<div class="post"><div class="post-header"><a href="#" class="username">${currentUsername}</a>, <span class="timestamp">${new Date(message.createdAt)}</span></div><div class="post-body">${message}</div><div class="post-footer">${room}</div></div>`);
  },

  clearMessages: () => {
    $('#chats').html('');
  },


  renderRoom: room => {
    $('#roomSelect').append(`<option value="${room}"">${room}</option>`);
  },
  //
  updateTimestamps: () => { //Keeps timestamps current
    var timestamps = $('#chats').find('.timestamp');
    for (let i = 0; i < timestamps.length; i++) {
      $(timestamps[i]).text($.timeago(app.messages[i].createdAt));
    }
  },

  handleUsernameClick: (user) => {
    if (!app.friends.hasOwnProperty(user)) {
      app.friends[user] = true;
    }
    
    if (!app.friendsHidden) {
      var postUsers = $('#chats').find('.username');
      for (let i = 0; i < postUsers.length; i++) {
        if ($(postUsers[i]).text() !== user) {
          $(postUsers[i]).parent().parent().remove();
        }
      }
      app.friendsHidden = true;
    } else {
      app.clearMessages();
      app.fetch();
    }
  },
  
  handleSubmit: message => {
    app.send(message);
  },
  
  showRooms: room => {
    _.each(app.messages, message => {
      app.renderMessage(message);
    });
    var posts = $('.post');
    for (var i = 0; i < posts.length; i++) {
      if ($(posts[i]).find('.post-footer').text() !== room) {
        $(posts[i]).remove();
      }
    }
  }
};

  

$(document).ready(() => {
  app.init();
  app.fetch();
  $('#current-room').text(app.currentRoom);
  setInterval(app.updateTimestamps, 1000);
  
});
