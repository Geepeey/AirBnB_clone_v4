$(document).ready(function() {
  const amenities = {};

  $('input[type=checkbox]').change(function() {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if (this.checked) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }

    const amenitiesList = Object.values(amenities).join(', ');
    $('.amenities h4').text(amenitiesList);
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $('button').click(function() {
    const amenityIds = Object.keys(amenities);
    const requestData = { amenities: amenityIds };

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify(requestData)
    })
    .done(function(data) {
      $('section.places').empty();

      for (const place of data) {
        const article = $('<article></article>');
        const placeName = $('<div class="title"></div>').text(place.name);
        const placePrice = $('<div class="price_by_night"></div>').text(`$${place.price_by_night}`);
        const placeInfo = $('<div class="information"></div>').append(placeName, placePrice);
        const placeDesc = $('<div class="description"></div>').text(place.description);
        article.append(placeInfo, placeDesc);
        $('section.places').append(article);
      }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log('Error:', errorThrown);
    });
  });
});
