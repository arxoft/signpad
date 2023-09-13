(function ($) {
  $.fn.signPad = function (args) {

    function initSignPad(el, options) {

      settings.signPadWidth = (settings.signPadWidth === 'auto') ? $(el).width() : settings.signPadWidth;

      // To check if the sign was done
      // Usage: $('.sign-pad')[0].isSigned();
      $(el)[0].isSigned = function () {
        return $(this).find('canvas').attr('data-is-signed') * 1 === 1;
      }

      // To get the signature data as image data URL
      // Usage: $('.sign-pad')[0].getDataURL();
      $(el)[0].getDataURL = function () {
        if (!$(el)[0].isSigned()) return '';
        return $(this).find('canvas').get(0).toDataURL("image/png");
      }

      var isLeftMButtonDown = false;

      // Canvas Element
      let divCanvas = $('<canvas />').html('initSignPad(): Unsupported Browser!');
      divCanvas.width(options.signPadWidth);
      divCanvas.height(options.signPadHeight);
      divCanvas.css("border", "1px solid #ccc");
      divCanvas.css("border-radius", "7px");
      divCanvas.attr('data-is-signed', 0);

      // Clear Button Element
      let buttonClear = $('<button />').addClass([options.clearButtonCssClass, 'btn-clear']).html(options.clearButtonText).on('click', function () {
        initSignPad(el, options);
      });

      $(el).find("canvas").remove();
      $(el).find("button").remove();
      $(el).append(buttonClear);
      $(el).append(divCanvas);

      let canvas = $(el).find("canvas").get(0);
      let canvasContext = canvas.getContext('2d');

      if (canvasContext) {
        canvasContext.canvas.width = options.signPadWidth;
        canvasContext.canvas.height = options.signPadHeight;

        canvasContext.fillStyle = "#fff";
        canvasContext.fillRect(0, 0, options.signPadWidth, options.signPadHeight);

        canvasContext.moveTo(50, 150);
        canvasContext.stroke();

        canvasContext.fillStyle = "#000";
        canvasContext.font = "20px Arial";
        canvasContext.lineWidth = 3;
      }

      // Bind Mouse events
      $(canvas).on('mousedown', function (e) {
        if (e.which === 1) {
          isLeftMButtonDown = true;
          canvasContext.fillStyle = "#000";

          var x = e.pageX - $(e.target).offset().left;
          var y = e.pageY - $(e.target).offset().top;

          canvasContext.moveTo(x, y);
        }
        e.preventDefault();
        return false;
      });

      $(canvas).on('mouseup', function (e) {
        if (isLeftMButtonDown && e.which === 1) {
          isLeftMButtonDown = false;
          $(e.target).attr('data-is-signed', 1);
        }
        e.preventDefault();
        return false;
      });

      // draw a line from the last point to this one
      $(canvas).on('mousemove', function (e) {
        if (isLeftMButtonDown == true) {
          canvasContext.fillStyle = "#000";
          var x = e.pageX - $(e.target).offset().left;
          var y = e.pageY - $(e.target).offset().top;
          canvasContext.lineTo(x, y);
          canvasContext.stroke();
        }
        e.preventDefault();
        return false;
      });

      //bind touch events
      $(canvas).on('touchstart', function (e) {
        isLeftMButtonDown = true;
        canvasContext.fillStyle = "#FF0000";
        var t = e.originalEvent.touches[0];
        var x = t.pageX - $(e.target).offset().left;
        var y = t.pageY - $(e.target).offset().top;

        canvasContext.moveTo(x, y);

        e.preventDefault();
        return false;
      });

      $(canvas).on('touchmove', function (e) {
        canvasContext.fillStyle = "#FF0000";

        var t = e.originalEvent.touches[0];
        var x = t.pageX - $(e.target).offset().left;
        var y = t.pageY - $(e.target).offset().top;

        canvasContext.lineTo(x, y);
        canvasContext.stroke();

        e.preventDefault();
        return false;
      });

      $(canvas).on('touchend', function (e) {
        if (isLeftMButtonDown) {
          isLeftMButtonDown = false;
          $(e.target).attr('data-is-signed', 1);
        }
      });
    }

    var settings = $.extend({
      signPadWidth: 'auto',
      signPadHeight: 150,
      clearButtonText: 'Clear',
      clearButtonCssClass: '',
    }, args);

    this.each(function () {
      initSignPad($(this), settings);
    });

    return this;
  };
}(jQuery));
