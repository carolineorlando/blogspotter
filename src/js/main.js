window.jQuery = require('jquery');
require('slick-carousel');

(function($){

	/**
	 * Randomize array element order in-place.
	 * Using Durstenfeld shuffle algorithm. (Fisher-Yates)
	 */
	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}

	var shuffledInterviews = shuffleArray(site.interviews);
	var counter = 0;

	function getItems(e){
		e.preventDefault();
		counter++;
		var n = 14;
		var $items = $('.items');
		var remove = [];

		if(counter > 1) {
			shuffledInterviews.splice(remove, n);
		}

		$.each(shuffledInterviews, function(i,val){
			if(i == n)
				return false; // break out of the loop on n

			var item = '<li class="item">';
			item += '<a href="'+ site.url + val.permalink +'">';
			item += '<img class="item-image" src="'+ site.url + val.image +'">';
			item += '<span class="item-meta">';
			item += '<span class="item-title">'+ val.title +'</span>';
			item += '<span class="item-attribution">by '+ val.name +'</span>';
			item += '</span>';
			item += '</a>';
			item += '</li>';
			var $item = $(item);
			$items.append($item);
			
			remove.push(i); // push the array items to toss
		});

		$('.items').find('.more').remove();
		$('.items').append('<li class="more item"><a href="#" class="more-items">More</a></li>');

		if(n >= shuffledInterviews.length)
			$('.more-items').remove();

		setTimeout(
			function(){ 
				$('.item').addClass('y');
				$('.footer').addClass('y');
			}, 100);

	}

	$(window).on('load', getItems);
	$('.items').on('click', '.more-items', getItems);

	$(window).on('load', function(){
		var slickEl = '.item-photo-strip';
		$(slickEl).slick({
			prevArrow: '<button type="button" class="slick-prev"><</button>',
			nextArrow: '<button type="button" class="slick-next">></button>',
			slidesToShow: 3,
			centerMode: true,
			variableWidth: true
		});
		$('.item-photo-strip').addClass('y');
	});


})(jQuery);