var app = {
  server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
  currentRoom: 'lobby',
  context: this,
  messages: [],
  messagesShown: 0,
  
  
  
  init: () => {
    $('#new-message').click(() => {
      $('#message-form').css('display', 'block');
    });
    $('#send').click(() => {
      console.log($('#message-box').val());
      app.send($('#message-box').val());
    });
    $('#alerts').click(() => {
      app.renderMessage(app.messages[app.messages.length - 1 - app.messagesShown]);
      app.messagesShown++;
      app.fetch();
      $('#alerts').text('Alerts');
    });
    $('#clear').click(() => {
      app.clearMessages();
    });
    $('#add-room').click(() => {
      app.renderRoom($('#new-room').val());
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
  
  send: (message) => {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        alert('Message sent!');
      },
      error: (data) => {
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
    $('#chats').append(`<div class="post"><div class="post-header"><a href="#">${message.username}</a>, ${new Date(message.createdAt)}</div><div class="post-body">${message.text}</div></div>`);
    // }
    // app.messagesShown += 20;
  },
  
  clearMessages: () => {
    $('#chats').html('');
  },

  
  renderRoom: (room) => {
    $('#roomSelect').append(`<option value = '${room}'>${room}</option>`);
  }
};

$(document).ready(() => {
  app.init();
  app.fetch();
});