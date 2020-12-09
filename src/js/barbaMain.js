document.addEventListener("DOMContentLoaded", function () {
  var lastElementClicked;

  const homePage = Barba.BaseView.extend({
    namespace: 'homePage',
    onEnterCompleted: function () {
      doThree()
    },

  });

  homePage.init()

  const newsPage = Barba.BaseView.extend({
    namespace: 'homePage',
    onEnterCompleted: function () {
      doThree()
    },

  });

  newsPage.init()

Barba.Pjax.start();






  Barba.Dispatcher.on('linkClicked', function(el) {
    lastElementClicked = el;
  });
  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {

      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {

      return $(this.oldContainer).animate({
          opacity: 0
        }, 400, function() {} ).promise()
    },

    fadeIn: function() {

      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility: 'visible',
        opacity: 0
      });

      $el.animate({
        opacity: 1
      }, 500, function() {

        _this.done();

      });
    }
  });


  Barba.Pjax.getTransition = function() {

      return FadeTransition;
  };
})
