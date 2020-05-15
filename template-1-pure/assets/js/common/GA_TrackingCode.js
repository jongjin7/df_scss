/*
 * Google Analytics
 * */

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

var TrackingCode = TrackingCode || (function() {

        var googleAccount = "UA-XXXXXXXX-Y";    //
        ga( 'create', googleAccount, 'auto' );

        // -----------------------------------------------
        // page view
        function _googlePageTagging( $page ) {
            ga('send', {
                hitType: 'pageview',
                page: $page
            });
        }

        // -----------------------------------------------
        // Event tracking
        function _googleEventTagging( $eventCategory, $eventAction) {

            ga('send', {
                hitType: 'event',
                eventCategory: $eventCategory,
                eventAction: $eventAction
                // ,eventLabel: 'Content Label',
            });
        }

        // ---------------------------------------------------------- 1. Clicks on External Links
        function _googleEventTagging_link( $eventCategory) {

            _googleEventTagging( $eventCategory, 'link btn');

        }

        // ---------------------------------------------------------- 2. Downloads
        function _googleEventTagging_download( $eventCategory) {

            _googleEventTagging( $eventCategory, 'download btn')

        }

        // ---------------------------------------------------------- 3. Media ( Videos, Music... )
        function _googleEventTagging_media( $eventCategory) {

            _googleEventTagging( $eventCategory, 'media btn')

        }


        // ---------------------------------------------------------- 4. SNS (Facebook, twitter... )
        function _googleEventTagging_sns( $eventCategory) {

            _googleEventTagging( $eventCategory, 'sns btn')

        }


        return {

            pageTagging: _googlePageTagging,

            eventTagging: _googleEventTagging,

            eventTagging_link: _googleEventTagging_link,
            eventTagging_download: _googleEventTagging_download,
            eventTagging_media: _googleEventTagging_media,
            eventTagging_sns: _googleEventTagging_sns
        }
})();