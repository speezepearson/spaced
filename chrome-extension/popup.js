document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submit').addEventListener('click', function() {
    var question = document.getElementById('question').value;
    var answer = document.getElementById('answer').value;
    var data = {questionMarkdown: question, answerMarkdown: answer};

    fetch('https://hearty-lemming-243.convex.site/httpCreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      if (response.ok) {
        window.close();
      } else {
        console.error('SRP: Error response:', response.status);
      }
    })
    .catch(function(error) {
      console.error('SRP: Error:', error);
    });
  });
});