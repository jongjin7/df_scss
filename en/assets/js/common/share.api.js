/**
share
**/

function share_contents( $sns_id, URL, TITLE, DEC, THUMB_BIG_FOR_PINTEREST )
{
	if($sns_id=='FB') {
		share_FB(URL);

	}else if($sns_id=='TW'){
		share_TW(URL, DEC);

	}else if($sns_id=='PR'){
		share_PR(URL, TITLE, DEC, THUMB_BIG_FOR_PINTEREST);


	}else if($sns_id=='GL'){
		share_GL(URL);

	}
}

// face book
function share_FB(url)
{
	var u = encodeURIComponent(url);
	window.open("https://www.facebook.com/sharer.php?u="+u,"Facebook_Share","width=650,height=310");
}

// twitter
function share_TW(url, dec)
{
	var u = encodeURIComponent(url);
	var t = encodeURIComponent(dec);
	window.open("http://twitter.com/share?url="+u+"&lang=ko&text="+t,"Twitter_Share","width=650,height=310");
}

// pinterest
function share_PR(url, title, dec, thumb_b_url)
{
	var u = encodeURIComponent(url);
	var t = encodeURIComponent(title) + " - " + encodeURIComponent(dec);
	var m = encodeURIComponent(thumb_b_url);
	window.open("http://pinterest.com/pin/create/button/?url="+u+"&media="+m+"&description="+t,"Pinterest_Share","width=770,height=310");
}

// google plus
function share_GL(url)
{
	var u = encodeURIComponent(url);
	window.open("https://plus.google.com/share?url="+u,"Goolge_Share","width=510,height=310");
}
