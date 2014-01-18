/**
 * Heartbeat API
 *
 * Note: this API is "experimental" meaning it will likely change a lot
 * in the next few releases based on feedback from 3.6.0. If you intend
 * to use it, please follow the development closely.
 *
 * Heartbeat is a simple server polling API that sends XHR requests to
<<<<<<< HEAD
 * the server every 15 seconds and triggers events (or callbacks) upon
 * receiving data. Currently these 'ticks' handle transports for post locking,
 * login-expiration warnings, and related tasks while a user is logged in.
 *
 * Available filters in ajax-actions.php:
=======
 * the server every 15 - 60 seconds and triggers events (or callbacks) upon
 * receiving data. Currently these 'ticks' handle transports for post locking,
 * login-expiration warnings, and related tasks while a user is logged in.
 *
 * Available PHP filters (in ajax-actions.php):
>>>>>>> wordpress/3.8-branch
 * - heartbeat_received
 * - heartbeat_send
 * - heartbeat_tick
 * - heartbeat_nopriv_received
 * - heartbeat_nopriv_send
 * - heartbeat_nopriv_tick
 * @see wp_ajax_nopriv_heartbeat(), wp_ajax_heartbeat()
 *
<<<<<<< HEAD
=======
 * Custom jQuery events:
 * - heartbeat-send
 * - heartbeat-tick
 * - heartbeat-error
 * - heartbeat-connection-lost
 * - heartbeat-connection-restored
 * - heartbeat-nonces-expired
 *
>>>>>>> wordpress/3.8-branch
 * @since 3.6.0
 */

( function( $, window, undefined ) {
	var Heartbeat = function() {
<<<<<<< HEAD
		var self = this,
			running,
			beat,
			screenId = typeof pagenow != 'undefined' ? pagenow : '',
			url = typeof ajaxurl != 'undefined' ? ajaxurl : '',
			settings,
			tick = 0,
			queue = {},
			interval,
			connecting,
			countdown = 0,
			errorcount = 0,
			tempInterval,
			hasFocus = true,
			isUserActive,
			userActiveEvents,
			winBlurTimeout,
			frameBlurTimeout = -1,
			hasConnectionError = false;

		/**
		 * Returns a boolean that's indicative of whether or not there is a connection error
		 *
		 * @returns boolean
		 */
		this.hasConnectionError = function() {
			return hasConnectionError;
		};

		if ( typeof( window.heartbeatSettings ) == 'object' ) {
			settings = $.extend( {}, window.heartbeatSettings );

			// Add private vars
			url = settings.ajaxurl || url;
			delete settings.ajaxurl;
			delete settings.nonce;

			interval = settings.interval || 15; // default interval
			delete settings.interval;
			// The interval can be from 15 to 60 sec. and can be set temporarily to 5 sec.
			if ( interval < 15 )
				interval = 15;
			else if ( interval > 60 )
				interval = 60;

			interval = interval * 1000;

			// 'screenId' can be added from settings on the front-end where the JS global 'pagenow' is not set
			screenId = screenId || settings.screenId || 'front';
			delete settings.screenId;

			// Add or overwrite public vars
			$.extend( this, settings );
		}
=======
		var $document = $(document),
			settings = {
				// Suspend/resume
				suspend: false,

				// Whether suspending is enabled
				suspendEnabled: true,

				// Current screen id, defaults to the JS global 'pagenow' when present (in the admin) or 'front'
				screenId: '',

				// XHR request URL, defaults to the JS global 'ajaxurl' when present
				url: '',

				// Timestamp, start of the last connection request
				lastTick: 0,

				// Container for the enqueued items
				queue: {},

				// Connect interval (in seconds)
				mainInterval: 60,

				// Used when the interval is set to 5 sec. temporarily
				tempInterval: 0,

				// Used when the interval is reset
				originalInterval: 0,

				// Used together with tempInterval
				countdown: 0,

				// Whether a connection is currently in progress
				connecting: false,

				// Whether a connection error occured
				connectionError: false,

				// Used to track non-critical errors
				errorcount: 0,

				// Whether at least one connection has completed successfully
				hasConnected: false,

				// Whether the current browser window is in focus and the user is active
				hasFocus: true,

				// Timestamp, last time the user was active. Checked every 30 sec.
				userActivity: 0,

				// Flags whether events tracking user activity were set
				userActivityEvents: false,

				// References to various timeouts
				beatTimer: 0,
				winBlurTimer: 0,
				frameBlurTimer: 0
			};

		/**
		 * Set local vars and events, then start
		 *
		 * @access private
		 *
		 * @return void
		 */
		function initialize() {
			if ( typeof window.pagenow === 'string' ) {
				settings.screenId = window.pagenow;
			}
>>>>>>> wordpress/3.8-branch

			if ( typeof window.ajaxurl === 'string' ) {
				settings.url = window.ajaxurl;
			}

			// Pull in options passed from PHP
			if ( typeof window.heartbeatSettings === 'object' ) {
				var options = window.heartbeatSettings;

				// The XHR URL can be passed as option when window.ajaxurl is not set
				if ( ! settings.url && options.ajaxurl ) {
					settings.url = options.ajaxurl;
				}

				// The interval can be from 15 to 60 sec. and can be set temporarily to 5 sec.
				if ( options.interval ) {
					settings.mainInterval = options.interval;

					if ( settings.mainInterval < 15 ) {
						settings.mainInterval = 15;
					} else if ( settings.mainInterval > 60 ) {
						settings.mainInterval = 60;
					}
				}

				// 'screenId' can be added from settings on the front-end where the JS global 'pagenow' is not set
				if ( ! settings.screenId ) {
					settings.screenId = options.screenId || 'front';
				}

				if ( options.suspension === 'disable' ) {
					settings.suspendEnabled = false;
				}
			}

			// Convert to milliseconds
			settings.mainInterval = settings.mainInterval * 1000;
			settings.originalInterval = settings.mainInterval;

			// Set focus/blur events on the window
			$(window).on( 'blur.wp-heartbeat-focus', function() {
				setFrameFocusEvents();
				// We don't know why the 'blur' was fired. Either the user clicked in an iframe or outside the browser.
				// Running blurred() after some timeout lets us cancel it if the user clicked in an iframe.
				settings.winBlurTimer = window.setTimeout( function(){ blurred(); }, 500 );
			}).on( 'focus.wp-heartbeat-focus', function() {
				removeFrameFocusEvents();
				focused();
			}).on( 'unload.wp-heartbeat', function() {
				// Don't connect any more
				settings.suspend = true;

				// Abort the last request if not completed
				if ( settings.xhr && settings.xhr.readyState !== 4 ) {
					settings.xhr.abort();
				}
			});

			// Check for user activity every 30 seconds.
			window.setInterval( function(){ checkUserActivity(); }, 30000 );

			// Start one tick after DOM ready
			$document.ready( function() {
				settings.lastTick = time();
				scheduleNextTick();
			});
		}

		/**
		 * Return the current time according to the browser
		 *
		 * @access private
		 *
		 * @return int
		 */
		function time() {
			return (new Date()).getTime();
		}

<<<<<<< HEAD
		function isLocalFrame( frame ) {
			var origin, src = frame.src;

			if ( src && /^https?:\/\//.test( src ) ) {
				origin = window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.host;

				if ( src.indexOf( origin ) !== 0 )
					return false;
=======
		/**
		 * Check if the iframe is from the same origin
		 *
		 * @access private
		 *
		 * @return bool
		 */
		function isLocalFrame( frame ) {
			var origin, src = frame.src;

			// Need to compare strings as WebKit doesn't throw JS errors when iframes have different origin.
			// It throws uncatchable exceptions.
			if ( src && /^https?:\/\//.test( src ) ) {
				origin = window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.host;

				if ( src.indexOf( origin ) !== 0 ) {
					return false;
				}
>>>>>>> wordpress/3.8-branch
			}

			try {
				if ( frame.contentWindow.document ) {
					return true;
				}
			} catch(e) {}

			return false;
		}

<<<<<<< HEAD
		// Set error state and fire an event on XHR errors or timeout
		function errorstate( error ) {
=======
		/**
		 * Set error state and fire an event on XHR errors or timeout
		 *
		 * @access private
		 *
		 * @param string error The error type passed from the XHR
		 * @param int status The HTTP status code passed from jqXHR (200, 404, 500, etc.)
		 * @return void
		 */
		function setErrorState( error, status ) {
>>>>>>> wordpress/3.8-branch
			var trigger;

			if ( error ) {
				switch ( error ) {
					case 'abort':
						// do nothing
						break;
					case 'timeout':
						// no response for 30 sec.
						trigger = true;
						break;
					case 'error':
						if ( 503 === status && settings.hasConnected ) {
							trigger = true;
							break;
						}
						/* falls through */
					case 'parsererror':
					case 'empty':
					case 'unknown':
						settings.errorcount++;

						if ( settings.errorcount > 2 && settings.hasConnected ) {
							trigger = true;
						}

						break;
				}

<<<<<<< HEAD
				if ( trigger && ! self.hasConnectionError() ) {
					hasConnectionError = true;
					$(document).trigger( 'heartbeat-connection-lost', [error] );
				}
			} else if ( self.hasConnectionError() ) {
				errorcount = 0;
				hasConnectionError = false;
				$(document).trigger( 'heartbeat-connection-restored' );
			}
		}

		function connect() {
			var send = {}, data, i, empty = true,
			nonce = typeof window.heartbeatSettings == 'object' ? window.heartbeatSettings.nonce : '';
			tick = time();

			data = $.extend( {}, queue );
			// Clear the data queue, anything added after this point will be send on the next tick
			queue = {};

			$(document).trigger( 'heartbeat-send', [data] );

			for ( i in data ) {
				if ( data.hasOwnProperty( i ) ) {
					empty = false;
					break;
				}
			}

			// If nothing to send (nothing is expecting a response),
			// schedule the next tick and bail
			if ( empty && ! self.hasConnectionError() ) {
				connecting = false;
				next();
				return;
			}

			send.data = data;
			send.interval = interval / 1000;
			send._nonce = nonce;
			send.action = 'heartbeat';
			send.screen_id = screenId;
			send.has_focus = hasFocus;
=======
				if ( trigger && ! hasConnectionError() ) {
					settings.connectionError = true;
					$document.trigger( 'heartbeat-connection-lost', [error, status] );
				}
			}
		}

		/**
		 * Clear the error state and fire an event
		 *
		 * @access private
		 *
		 * @return void
		 */
		function clearErrorState() {
			// Has connected successfully
			settings.hasConnected = true;

			if ( hasConnectionError() ) {
				settings.errorcount = 0;
				settings.connectionError = false;
				$document.trigger( 'heartbeat-connection-restored' );
			}
		}

		/**
		 * Gather the data and connect to the server
		 *
		 * @access private
		 *
		 * @return void
		 */
		function connect() {
			var ajaxData, heartbeatData;

			// If the connection to the server is slower than the interval,
			// heartbeat connects as soon as the previous connection's response is received.
			if ( settings.connecting || settings.suspend ) {
				return;
			}

			settings.lastTick = time();
>>>>>>> wordpress/3.8-branch

			heartbeatData = $.extend( {}, settings.queue );
			// Clear the data queue, anything added after this point will be send on the next tick
			settings.queue = {};

			$document.trigger( 'heartbeat-send', [ heartbeatData ] );

			ajaxData = {
				data: heartbeatData,
				interval: settings.tempInterval ? settings.tempInterval / 1000 : settings.mainInterval / 1000,
				_nonce: typeof window.heartbeatSettings === 'object' ? window.heartbeatSettings.nonce : '',
				action: 'heartbeat',
				screen_id: settings.screenId,
				has_focus: settings.hasFocus
			};

			settings.connecting = true;
			settings.xhr = $.ajax({
				url: settings.url,
				type: 'post',
				timeout: 30000, // throw an error if not completed after 30 sec.
<<<<<<< HEAD
				data: send,
				dataType: 'json'
			}).done( function( response, textStatus, jqXHR ) {
				var new_interval;

				if ( ! response )
					return errorstate( 'empty' );

				// Clear error state
				if ( self.hasConnectionError() )
					errorstate();
=======
				data: ajaxData,
				dataType: 'json'
			}).always( function() {
				settings.connecting = false;
				scheduleNextTick();
			}).done( function( response, textStatus, jqXHR ) {
				var newInterval;

				if ( ! response ) {
					setErrorState( 'empty' );
					return;
				}

				clearErrorState();

				if ( response.nonces_expired ) {
					$document.trigger( 'heartbeat-nonces-expired' );
					return;
				}
>>>>>>> wordpress/3.8-branch

				if ( response.nonces_expired ) {
					$(document).trigger( 'heartbeat-nonces-expired' );
					return;
				}

				// Change the interval from PHP
				if ( response.heartbeat_interval ) {
<<<<<<< HEAD
					new_interval = response.heartbeat_interval;
					delete response.heartbeat_interval;
				}

				self.tick( response, textStatus, jqXHR );
=======
					newInterval = response.heartbeat_interval;
					delete response.heartbeat_interval;
				}

				$document.trigger( 'heartbeat-tick', [response, textStatus, jqXHR] );
>>>>>>> wordpress/3.8-branch

				// Do this last, can trigger the next XHR if connection time > 5 sec. and newInterval == 'fast'
				if ( newInterval ) {
					interval( newInterval );
				}
			}).fail( function( jqXHR, textStatus, error ) {
				setErrorState( textStatus || 'unknown', jqXHR.status );
				$document.trigger( 'heartbeat-error', [jqXHR, textStatus, error] );
			});
		}

		/**
		 * Schedule the next connection
		 *
		 * Fires immediately if the connection time is longer than the interval.
		 *
		 * @access private
		 *
		 * @return void
		 */
		function scheduleNextTick() {
			var delta = time() - settings.lastTick,
				interval = settings.mainInterval;

<<<<<<< HEAD
			if ( ! running )
=======
			if ( settings.suspend ) {
>>>>>>> wordpress/3.8-branch
				return;
			}

			if ( ! settings.hasFocus ) {
				interval = 120000; // 120 sec. Post locks expire after 150 sec.
			} else if ( settings.countdown > 0 && settings.tempInterval ) {
				interval = settings.tempInterval;
				settings.countdown--;

<<<<<<< HEAD
			if ( ! hasFocus ) {
				t = 100000; // 100 sec. Post locks expire after 120 sec.
			} else if ( countdown > 0 && tempInterval ) {
				t = tempInterval;
				countdown--;
=======
				if ( settings.countdown < 1 ) {
					settings.tempInterval = 0;
				}
>>>>>>> wordpress/3.8-branch
			}

			window.clearTimeout( settings.beatTimer );

			if ( delta < interval ) {
				settings.beatTimer = window.setTimeout(
					function() {
							connect();
					},
					interval - delta
				);
			} else {
				connect();
			}
		}

		/**
		 * Set the internal state when the browser window looses focus
		 *
		 * @access private
		 *
		 * @return void
		 */
		function blurred() {
<<<<<<< HEAD
			window.clearTimeout(winBlurTimeout);
			window.clearTimeout(frameBlurTimeout);
			winBlurTimeout = frameBlurTimeout = 0;

			hasFocus = false;
=======
			clearFocusTimers();
			settings.hasFocus = false;
>>>>>>> wordpress/3.8-branch
		}

		/**
		 * Set the internal state when the browser window is focused
		 *
		 * @access private
		 *
		 * @return void
		 */
		function focused() {
			clearFocusTimers();
			settings.userActivity = time();

			// Resume if suspended
			settings.suspend = false;

<<<<<<< HEAD
			hasFocus = true;
			window.clearTimeout(beat);

			if ( ! connecting )
				next();
		}

		function setFrameEvents() {
			$('iframe').each( function( i, frame ){
				if ( ! isLocalFrame( frame ) )
=======
			if ( ! settings.hasFocus ) {
				settings.hasFocus = true;
				scheduleNextTick();
			}
		}

		/**
		 * Add focus/blur events to all local iframes
		 *
		 * Used to detect when focus is moved from the main window to an iframe
		 *
		 * @access private
		 *
		 * @return void
		 */
		function setFrameFocusEvents() {
			$('iframe').each( function( i, frame ) {
				if ( ! isLocalFrame( frame ) ) {
>>>>>>> wordpress/3.8-branch
					return;
				}

<<<<<<< HEAD
				if ( $.data( frame, 'wp-heartbeat-focus' ) )
=======
				if ( $.data( frame, 'wp-heartbeat-focus' ) ) {
>>>>>>> wordpress/3.8-branch
					return;
				}

				$.data( frame, 'wp-heartbeat-focus', 1 );

<<<<<<< HEAD
				$( frame.contentWindow ).on( 'focus.wp-heartbeat-focus', function(e) {
					focused();
				}).on('blur.wp-heartbeat-focus', function(e) {
					setFrameEvents();
					frameBlurTimeout = window.setTimeout( function(){ blurred(); }, 500 );
=======
				$( frame.contentWindow ).on( 'focus.wp-heartbeat-focus', function() {
					focused();
				}).on('blur.wp-heartbeat-focus', function() {
					setFrameFocusEvents();
					// We don't know why 'blur' was fired. Either the user clicked in the main window or outside the browser.
					// Running blurred() after some timeout lets us cancel it if the user clicked in the main window.
					settings.frameBlurTimer = window.setTimeout( function(){ blurred(); }, 500 );
>>>>>>> wordpress/3.8-branch
				});
			});
		}

<<<<<<< HEAD
		$(window).on( 'blur.wp-heartbeat-focus', function(e) {
			setFrameEvents();
			winBlurTimeout = window.setTimeout( function(){ blurred(); }, 500 );
		}).on( 'focus.wp-heartbeat-focus', function() {
			$('iframe').each( function( i, frame ) {
				if ( !isLocalFrame( frame ) )
=======
		/**
		 * Remove the focus/blur events to all local iframes
		 *
		 * @access private
		 *
		 * @return void
		 */
		function removeFrameFocusEvents() {
			$('iframe').each( function( i, frame ) {
				if ( ! isLocalFrame( frame ) ) {
>>>>>>> wordpress/3.8-branch
					return;
				}

				$.removeData( frame, 'wp-heartbeat-focus' );
				$( frame.contentWindow ).off( '.wp-heartbeat-focus' );
			});
		}

		/**
		 * Clear the reset timers for focus/blur events on the window and iframes
		 *
		 * @access private
		 *
		 * @return void
		 */
		function clearFocusTimers() {
			window.clearTimeout( settings.winBlurTimer );
			window.clearTimeout( settings.frameBlurTimer );
		}

		/**
		 * Runs when the user becomes active after a period of inactivity
		 *
		 * @access private
		 *
		 * @return void
		 */
		function userIsActive() {
<<<<<<< HEAD
			userActiveEvents = false;
			$(document).off( '.wp-heartbeat-active' );
			$('iframe').each( function( i, frame ) {
				if ( ! isLocalFrame( frame ) )
=======
			settings.userActivityEvents = false;
			$document.off( '.wp-heartbeat-active' );

			$('iframe').each( function( i, frame ) {
				if ( ! isLocalFrame( frame ) ) {
>>>>>>> wordpress/3.8-branch
					return;
				}

				$( frame.contentWindow ).off( '.wp-heartbeat-active' );
			});

			focused();
		}

		/**
		 * Check for user activity
		 *
		 * Runs every 30 sec.
		 * Sets 'hasFocus = true' if user is active and the window is in the background.
		 * Set 'hasFocus = false' if the user has been inactive (no mouse or keyboard activity)
		 * for 5 min. even when the window has focus.
		 *
		 * @access private
		 *
		 * @return void
		 */
		function checkUserActivity() {
			var lastActive = settings.userActivity ? time() - settings.userActivity : 0;

<<<<<<< HEAD
			// Throttle down when no mouse or keyboard activity for 5 min
			if ( lastActive > 300000 && hasFocus )
				 blurred();

			if ( ! userActiveEvents ) {
				$(document).on( 'mouseover.wp-heartbeat-active keyup.wp-heartbeat-active', function(){ userIsActive(); } );

				$('iframe').each( function( i, frame ) {
					if ( ! isLocalFrame( frame ) )
=======
			if ( lastActive > 300000 && settings.hasFocus ) {
				// Throttle down when no mouse or keyboard activity for 5 min
				blurred();
			}

			if ( settings.suspendEnabled && lastActive > 1200000 ) {
				// Suspend after 20 min. of inactivity
				settings.suspend = true;
			}

			if ( ! settings.userActivityEvents ) {
				$document.on( 'mouseover.wp-heartbeat-active keyup.wp-heartbeat-active', function(){ userIsActive(); } );

				$('iframe').each( function( i, frame ) {
					if ( ! isLocalFrame( frame ) ) {
>>>>>>> wordpress/3.8-branch
						return;
					}

					$( frame.contentWindow ).on( 'mouseover.wp-heartbeat-active keyup.wp-heartbeat-active', function(){ userIsActive(); } );
				});

				settings.userActivityEvents = true;
			}
		}

<<<<<<< HEAD
		// Check for user activity every 30 seconds.
		window.setInterval( function(){ checkUserActive(); }, 30000 );
		$(document).ready( function() {
			// Start one tick (15 sec) after DOM ready
			running = true;
			tick = time();
			next();
		});

		this.hasFocus = function() {
			return hasFocus;
		};
=======
		// Public methods

		/**
		 * Whether the window (or any local iframe in it) has focus, or the user is active
		 *
		 * @return bool
		 */
		function hasFocus() {
			return settings.hasFocus;
		}

		/**
		 * Whether there is a connection error
		 *
		 * @return bool
		 */
		function hasConnectionError() {
			return settings.connectionError;
		}

		/**
		 * Connect asap regardless of 'hasFocus'
		 *
		 * Will not open two concurrent connections. If a connection is in progress,
		 * will connect again immediately after the current connection completes.
		 *
		 * @return void
		 */
		function connectNow() {
			settings.lastTick = 0;
			scheduleNextTick();
		}

		/**
		 * Disable suspending
		 *
		 * Should be used only when Heartbeat is performing critical tasks like autosave, post-locking, etc.
		 * Using this on many screens may overload the user's hosting account if several
		 * browser windows/tabs are left open for a long time.
		 *
		 * @return void
		 */
		function disableSuspend() {
			settings.suspendEnabled = false;
		}
>>>>>>> wordpress/3.8-branch

		/**
		 * Get/Set the interval
		 *
		 * When setting to 'fast' or 5, by default interval is 5 sec. for the next 30 ticks (for 2 min and 30 sec).
		 * In this case the number of 'ticks' can be passed as second argument.
		 * If the window doesn't have focus, the interval slows down to 2 min.
		 *
<<<<<<< HEAD
		 * @param string speed Interval speed: 'fast' (5sec), 'standard' (15sec) default, 'slow' (60sec)
		 * @param string ticks Used with speed = 'fast', how many ticks before the speed reverts back
		 * @return int Current interval in seconds
		 */
		this.interval = function( speed, ticks ) {
			var reset, seconds;
			ticks = parseInt( ticks, 10 ) || 30;
			ticks = ticks < 1 || ticks > 30 ? 30 : ticks;
=======
		 * @param mixed speed Interval: 'fast' or 5, 15, 30, 60
		 * @param string ticks Used with speed = 'fast' or 5, how many ticks before the interval reverts back
		 * @return int Current interval in seconds
		 */
		function interval( speed, ticks ) {
			var newInterval,
				oldInterval = settings.tempInterval ? settings.tempInterval : settings.mainInterval;
>>>>>>> wordpress/3.8-branch

			if ( speed ) {
				switch ( speed ) {
					case 'fast':
<<<<<<< HEAD
						seconds = 5;
						countdown = ticks;
=======
					case 5:
						newInterval = 5000;
						break;
					case 15:
						newInterval = 15000;
>>>>>>> wordpress/3.8-branch
						break;
					case 30:
						newInterval = 30000;
						break;
					case 60:
						newInterval = 60000;
						break;
					case 'long-polling':
						// Allow long polling, (experimental)
						settings.mainInterval = 0;
						return 0;
					default:
						newInterval = settings.originalInterval;
				}

				if ( 5000 === newInterval ) {
					ticks = parseInt( ticks, 10 ) || 30;
					ticks = ticks < 1 || ticks > 30 ? 30 : ticks;

					settings.countdown = ticks;
					settings.tempInterval = newInterval;
				} else {
					settings.countdown = 0;
					settings.tempInterval = 0;
					settings.mainInterval = newInterval;
				}

				// Change the next connection time if new interval has been set.
				// Will connect immediately if the time since the last connection
				// is greater than the new interval.
				if ( newInterval !== oldInterval ) {
					scheduleNextTick();
				}
			}

<<<<<<< HEAD
			if ( ! hasFocus )
				return 120;

			return tempInterval ? tempInterval / 1000 : interval / 1000;
		};
=======
			return settings.tempInterval ? settings.tempInterval / 1000 : settings.mainInterval / 1000;
		}
>>>>>>> wordpress/3.8-branch

		/**
		 * Enqueue data to send with the next XHR
		 *
		 * As the data is send asynchronously, this function doesn't return the XHR response.
		 * To see the response, use the custom jQuery event 'heartbeat-tick' on the document, example:
		 *		$(document).on( 'heartbeat-tick.myname', function( event, data, textStatus, jqXHR ) {
		 *			// code
		 *		});
		 * If the same 'handle' is used more than once, the data is not overwritten when the third argument is 'true'.
		 * Use wp.heartbeat.isQueued('handle') to see if any data is already queued for that handle.
		 *
		 * $param string handle Unique handle for the data. The handle is used in PHP to receive the data.
		 * $param mixed data The data to send.
		 * $param bool noOverwrite Whether to overwrite existing data in the queue.
		 * $return bool Whether the data was queued or not.
		 */
		function enqueue( handle, data, noOverwrite ) {
			if ( handle ) {
<<<<<<< HEAD
				if ( queue.hasOwnProperty( handle ) && dont_overwrite )
=======
				if ( noOverwrite && this.isQueued( handle ) ) {
>>>>>>> wordpress/3.8-branch
					return false;
				}

				settings.queue[handle] = data;
				return true;
			}
			return false;
		};

		/**
		 * Check if data with a particular handle is queued
		 *
		 * $param string handle The handle for the data
		 * $return bool Whether some data is queued with this handle
		 */
		function isQueued( handle ) {
			if ( handle ) {
				return settings.queue.hasOwnProperty( handle );
			}
		}

		/**
		 * Remove data with a particular handle from the queue
		 *
		 * $param string handle The handle for the data
		 * $return void
		 */
<<<<<<< HEAD
		this.isQueued = function( handle ) {
			return queue[handle];
		};
	};

	$.extend( Heartbeat.prototype, {
		tick: function( data, textStatus, jqXHR ) {
			$(document).trigger( 'heartbeat-tick', [data, textStatus, jqXHR] );
		},
		error: function( jqXHR, textStatus, error ) {
			$(document).trigger( 'heartbeat-error', [jqXHR, textStatus, error] );
=======
		function dequeue( handle ) {
			if ( handle ) {
				delete settings.queue[handle];
			}
		}

		/**
		 * Get data that was enqueued with a particular handle
		 *
		 * $param string handle The handle for the data
		 * $return mixed The data or undefined
		 */
		function getQueuedItem( handle ) {
			if ( handle ) {
				return this.isQueued( handle ) ? settings.queue[handle] : undefined;
			}
>>>>>>> wordpress/3.8-branch
		}

		initialize();

		// Expose public methods
		return {
			hasFocus: hasFocus,
			connectNow: connectNow,
			disableSuspend: disableSuspend,
			interval: interval,
			hasConnectionError: hasConnectionError,
			enqueue: enqueue,
			dequeue: dequeue,
			isQueued: isQueued,
			getQueuedItem: getQueuedItem
		};
	};

	// Ensure the global `wp` object exists.
	window.wp = window.wp || {};
	window.wp.heartbeat = new Heartbeat();

}( jQuery, window ));
