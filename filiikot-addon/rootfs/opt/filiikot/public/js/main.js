function getData() {
  $.getJSON('/data', (data) => {
    $.each(data, (key, val) => {
      $(`#${key}`).html(val);
    });
    $('#image').attr('src', `img/${data.state}.png`);
  });
}

$(document).ready(() => {
  setInterval(getData, 10000);
});
