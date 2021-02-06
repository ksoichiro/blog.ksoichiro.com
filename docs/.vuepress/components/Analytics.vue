<template>
  <div>
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="/__/firebase/8.2.6/firebase-app.js"></script>

    <!-- Add SDKs for Firebase products that you want to use
         https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src="/__/firebase/8.2.6/firebase-analytics.js"></script>

    <!-- Initialize Firebase -->
    <script src="/__/firebase/init.js"></script>

    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css" />

    <script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"></script>
    <script>
      window.addEventListener("load", function () {
        window.cookieconsent.initialise({
          palette: {
            popup: {
              "background": "#D8DEE9",
              "text": "#2E3440"
            },
            button: {
              "background": "#5E81AC"
            }
          },
          onInitialise: function(status) {
            if (this.hasConsented()) {
              if (typeof firebase !== 'undefined') {
                firebase.analytics();
              }
            }
          },
          onStatusChange: function (status) {
            if (this.hasConsented()) {
              if (typeof firebase !== 'undefined') {
                firebase.analytics();
              }
            }
          },
          type: "opt-out"
        });
      });
    </script>
  </div>
</template>
