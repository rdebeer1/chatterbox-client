var app = {
  server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
  currentRoom: 'lobby',
  context: this,
  friends: {},
  messages: [],
  messagesShown: 0,
  username: $('#username').val(),



  init: () => {
    $('#post').click(() => {
      $('.overlay').slideToggle();
    });
    $('#message-form').submit((e) => {
      console.log(message)
      let message = {
        username: app.username,
        text: $('#message-box').val(),
        roomname: app.currentRoom
      };
      e.preventDefault();
      app.send(message);
    });
    $('#new').click(() => {
      app.renderMessage(app.messages[app.messages.length - 1 - app.messagesShown]);
      app.messagesShown++;
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
  },

  fetch: () => {
    $.get(app.server, response => {
      if (app.messages.length === 0) {
        _.each(response.results, (message) => {
          app.messages.push(message);
        });
        setInterval(app.fetch, 5000);
      } else {
        $('#alerts').text('New messages!');
      }
    });
  },

  send: message => {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: () => {
        alert('Message sent!');
      },
      error: () => {
        alert('Message failed to send');
      }
    });
  },

  renderMessage: message => {
    // for (let i = app.messagesShown; i < app.messagesShown + 20; i++) {
    //   let message = app.messages[i];
    //   if (message === undefined) {
    //     return;
    //   }
    $('#chats').append(`<div class="post"><div class="post-header"><a href="#" class="username">${message.username}</a>, <span class="timestamp">${new Date(message.createdAt)}<span></div><div class="post-body">${message.text}</div></div>`);
     $('.username').click(() => {
       app.handleUsernameClick(message.username);
     });// }
    // app.messagesShown += 20;
  },

  clearMessages: () => {
    $('#chats').html('');
  },


  renderRoom: room => {
    $('#roomSelect').append(`<option value='${room}'>${room}</option>`);
  },
  //
  updateTimestamps: () => {                                           //Keeps timestamps current
    var timestamps = $('#chats').find('.timestamp');
    for (let i = 0; i < timestamps.length; i++) {
      $(timestamps[i]).text($.timeago(app.messages[i].createdAt));
    }
  },

  handleUsernameClick: (user) => {
    if (!app.friends.hasOwnProperty(user)) {
    app.friends[user] = true;
    }
    var postUsers = $('#chats').find('.username');
    for (let i = 0; i < postUsers.length; i++) {
      if ($(postUsers[i]).text() !== user) {
        $(postUsers[i]).parent().parent().hide();
      }
    }
  }
};

$(document).ready(() => {
  app.init();
  app.fetch();
  setInterval(app.updateTimestamps, 1000);
});
