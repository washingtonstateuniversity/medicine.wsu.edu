<?php

namespace WSU\Medicine\Constant_Contact;

add_shortcode( 'constant_contact_events', 'WSU\Medicine\Constant_Contact\display_events_shortcode' );

/**
 * Display a Constant Contact events list.
 *
 * @since 0.2.0
 *
 * @return string
 */
function display_events_shortcode() {
	ob_start();

	// @codingStandardsIgnoreStart
	// The script writes to the document in place, so it cannot be enqueued without additional code.
	?>
	<!-- start of Constant Contact script -->
	<div id="idCTCTEventWidget" class="ctct_eventwidget_outer" style="border: 1px dotted #c0c0c0; padding: 5px 10px">
		<div class="ctct_eventwidget_title" style="width: 100%; text-align: center; text-decoration: underline; font-weight: bold">Upcoming Events</div>
		<br />
		<script type="text/javascript" src="https://eventsfeed.constantcontact.com/widget/myevents.js?eso=001OOmTdcjovk8EtDEJJz_oXw==&datetime=true&desc=false&location=false&skiphomepage=false&numevents=5"></script>
		<br />
		<span style="text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#999999;"><a href="http://www.constantcontact.com/event-marketing/index.jsp" rel="nofollow" style="text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#999999;">Online Event Registration</a> by <a href="http://www.constantcontact.com/event-marketing/index.jsp" rel="nofollow" style="text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#999999;">Constant Contact</a></span>
	</div>
	<!-- end of Constant Contact script -->
	<?php
	// @codingStandardsIgnoreEnd

	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}
