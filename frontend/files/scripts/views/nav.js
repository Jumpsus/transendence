import { Component } from "../library/component.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";
import { myUsername } from "../../index.js";

export class Nav extends Component {
  constructor() {
    super(document.getElementById("navigation-wrapper"));
    this.view = `
			<nav class="menu-nav d-flex flex-grow-1 rounded-0 me-sm-0 sticky-md-top sticky-bottom flex-sm-column flex-row pt-lg-3 pt-sm-5 p-3 pb-sm-5 px-4 justify-content-sm-start justify-content-evenly gap-lg-4 gap-5"
			id="homeNav">
				<h1 class=" d-lg-block d-none align-self-center" id="project-title">PONG</h1>
				<a href="/" class="nav-link d-flex justify-content-lg-start justify-content-center menu-item" data-link>
					<div class="d-flex align-items-center w-100">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Computers-Devices-Electronicscd-Disk--Streamline-Pixel" fill="currentColor" height="40" width="40"><desc>Computers Devices Electronicscd Disk Streamline Icon: https://streamlinehq.com</desc><title>computers-devices-electronicscd-disk</title><g><path d="m22.86 6.855 -1.1475 0 0 3.435 -4.5675 0 0 1.1400000000000001 1.1400000000000001 0 0 1.1400000000000001 1.1475 0 0 -1.1400000000000001 1.1400000000000001 0 0 1.1400000000000001 1.1400000000000001 0 0 -1.1400000000000001 1.1475 0 0 1.1400000000000001 -1.1475 0 0 1.1475 1.1475 0 0 1.1400000000000001 1.1400000000000001 0 0 -5.715 -1.1400000000000001 0 0 -2.2874999999999996z"  stroke-width="1"></path><path d="m21.7125 15.997499999999999 -1.1400000000000001 0 0 -1.1400000000000001 -1.1400000000000001 0 0 -1.1400000000000001 -1.1475 0 0 1.1400000000000001 -1.1400000000000001 0 0 -1.1400000000000001 -1.1475 0 0 -1.1475 1.1475 0 0 -1.1400000000000001 -1.1475 0 0 -1.1400000000000001 -1.1400000000000001 0 0 3.4275 -1.1400000000000001 0 0 1.1400000000000001 -3.435 0 0 1.1400000000000001 3.435 0 0 1.1475 1.1400000000000001 0 0 2.2874999999999996 1.1400000000000001 0 0 2.2800000000000002 -1.1400000000000001 0 0 1.1475 2.2874999999999996 0 0 -1.1475 2.2874999999999996 0 0 -1.1400000000000001 1.1400000000000001 0 0 -1.1400000000000001 1.1400000000000001 0 0 -2.2874999999999996 1.1475 0 0 -2.2874999999999996 -1.1475 0 0 1.1400000000000001z"  stroke-width="1"></path><path d="M20.572499999999998 13.7175h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 4.574999999999999h1.1400000000000001v2.2800000000000002h-1.1400000000000001Z"  stroke-width="1"></path><path d="M19.4325 12.57h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M19.4325 3.4275h1.1400000000000001V4.574999999999999h-1.1400000000000001Z"  stroke-width="1"></path><path d="M17.145 12.57h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M17.145 2.2874999999999996h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"  stroke-width="1"></path><path d="M14.857499999999998 1.1475h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"  stroke-width="1"></path><path d="M13.7175 9.1425h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M9.1425 22.86h5.715V24h-5.715Z"  stroke-width="1"></path><path d="M13.7175 10.290000000000001h-3.435v3.4275h3.435Zm-1.1475 2.2800000000000002h-1.1400000000000001v-1.1400000000000001h1.1400000000000001Z"  stroke-width="1"></path><path d="m10.2825 4.574999999999999 1.1475 0 0 -3.4275 3.4275 0 0 -1.1475 -5.715 0 0 1.1475 1.1400000000000001 0 0 3.4275z"  stroke-width="1"></path><path d="M9.1425 13.7175h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M6.855 21.7125h2.2874999999999996v1.1475H6.855Z"  stroke-width="1"></path><path d="m9.1425 10.290000000000001 1.1400000000000001 0 0 -1.1475 3.435 0 0 -1.1400000000000001 -1.1475 0 0 -3.4275 -1.1400000000000001 0 0 3.4275 -1.1475 0 0 -1.1475 -1.1400000000000001 0 0 2.2874999999999996 -2.2874999999999996 0 0 1.1475 1.1475 0 0 3.4275 1.1400000000000001 0 0 -3.4275z"  stroke-width="1"></path><path d="M8.0025 4.574999999999999h1.1400000000000001v2.2800000000000002h-1.1400000000000001Z"  stroke-width="1"></path><path d="M6.855 18.285h2.2874999999999996v1.1475H6.855Z"  stroke-width="1"></path><path d="M4.574999999999999 20.572499999999998h2.2800000000000002v1.1400000000000001H4.574999999999999Z"  stroke-width="1"></path><path d="M5.715 17.145h1.1400000000000001v1.1400000000000001H5.715Z"  stroke-width="1"></path><path d="M4.574999999999999 8.0025h2.2800000000000002v1.1400000000000001H4.574999999999999Z"  stroke-width="1"></path><path d="m6.855 4.574999999999999 1.1475 0 0 -2.2874999999999996 1.1400000000000001 0 0 -1.1400000000000001 -2.2874999999999996 0 0 1.1400000000000001 -2.2800000000000002 0 0 1.1400000000000001 2.2800000000000002 0 0 1.1475z"  stroke-width="1"></path><path d="M4.574999999999999 14.857499999999998h1.1400000000000001v2.2874999999999996H4.574999999999999Z"  stroke-width="1"></path><path d="M3.4275 19.4325H4.574999999999999v1.1400000000000001H3.4275Z"  stroke-width="1"></path><path d="M3.4275 3.4275H4.574999999999999V4.574999999999999H3.4275Z"  stroke-width="1"></path><path d="M2.2874999999999996 17.145h1.1400000000000001v2.2874999999999996H2.2874999999999996Z"  stroke-width="1"></path><path d="M1.1400000000000001 14.857499999999998h1.1475v2.2874999999999996H1.1400000000000001Z"  stroke-width="1"></path><path d="m2.2874999999999996 8.0025 2.2874999999999996 0 0 -1.1475 -1.1475 0 0 -2.2800000000000002 -1.1400000000000001 0 0 2.2800000000000002 -1.1475 0 0 2.2874999999999996 1.1475 0 0 -1.1400000000000001z"  stroke-width="1"></path><path d="M0 9.1425h1.1400000000000001v5.715H0Z"  stroke-width="1"></path></g></svg>
						<div class="ms-3 fs-5 d-lg-block d-none">Play</div>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ms-auto menu-selector" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M10 20H8V4H10V6H12V9H14V11H16V13H14V15H12V18H10V20Z"/>
						</svg>
					</div>
				</a>
				<a href="/Tournament" class="nav-link d-flex justify-content-lg-start justify-content-center menu-item" data-link>
					<div class="d-flex align-items-center w-100">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Interface-Essential-Trophy--Streamline-Pixel" fill="currentColor" height="40" width="40"><desc>Interface Essential Trophy Streamline Icon: https://streamlinehq.com</desc><title>interface-essential-trophy</title><g><path d="M22.28625 4.005h1.1400000000000001v5.7075000000000005h-1.1400000000000001Z"  stroke-width="1"></path><path d="m19.99875 4.005 2.2874999999999996 0 0 -1.1475 -2.2874999999999996 0 0 -1.1400000000000001 -1.1400000000000001 0 0 11.43 1.1400000000000001 0 0 -2.2874999999999996 2.2874999999999996 0 0 -1.1475 -2.2874999999999996 0 0 -5.7075000000000005z"  stroke-width="1"></path><path d="M17.71125 13.1475h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="M16.57125 14.287500000000001h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="m7.428749999999999 22.29 0 -1.1475 -1.1400000000000001 0 0 1.1475 -1.1475 0 0 1.1400000000000001 13.7175 0 0 -1.1400000000000001 -1.1475 0 0 -1.1475 -1.1400000000000001 0 0 1.1475 -9.1425 0z"  stroke-width="1"></path><path d="M14.283750000000001 20.0025h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"  stroke-width="1"></path><path d="M14.283750000000001 15.4275h2.2874999999999996v1.1475h-2.2874999999999996Z"  stroke-width="1"></path><path d="m13.143749999999999 6.285 0 -2.2800000000000002 -2.2874999999999996 0 0 2.2800000000000002 -3.4275 0 0 1.1475 1.1400000000000001 0 0 1.1400000000000001 1.1475 0 0 1.1400000000000001 -1.1475 0 0 2.2874999999999996 2.2874999999999996 0 0 -1.1400000000000001 2.2874999999999996 0 0 1.1400000000000001 2.2874999999999996 0 0 -2.2874999999999996 -1.1475 0 0 -1.1400000000000001 1.1475 0 0 -1.1400000000000001 1.1400000000000001 0 0 -1.1475 -3.4275 0z"  stroke-width="1"></path><path d="M13.143749999999999 16.575000000000003h1.1400000000000001v3.4275h-1.1400000000000001Z"  stroke-width="1"></path><path d="M9.71625 16.575000000000003h1.1400000000000001v3.4275h-1.1400000000000001Z"  stroke-width="1"></path><path d="M7.428749999999999 20.0025h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"  stroke-width="1"></path><path d="M7.428749999999999 15.4275h2.2874999999999996v1.1475h-2.2874999999999996Z"  stroke-width="1"></path><path d="M6.28875 14.287500000000001h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M5.14125 0.5700000000000001h13.7175v1.1475H5.14125Z"  stroke-width="1"></path><path d="M5.14125 13.1475h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="m5.14125 1.7175 -1.1400000000000001 0 0 1.1400000000000001 -2.2874999999999996 0 0 1.1475 2.2874999999999996 0 0 5.7075000000000005 -2.2874999999999996 0 0 1.1475 2.2874999999999996 0 0 2.2874999999999996 1.1400000000000001 0 0 -11.43z"  stroke-width="1"></path><path d="M0.57375 4.005h1.1400000000000001v5.7075000000000005H0.57375Z"  stroke-width="1"></path></g></svg>
						<div class="ms-3 fs-5 d-lg-block d-none">Contest</div>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ms-auto menu-selector" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M10 20H8V4H10V6H12V9H14V11H16V13H14V15H12V18H10V20Z"/>
						</svg>
					</div>
				</a>
				<a href="/Chat" class="nav-link d-flex justify-content-lg-start justify-content-center menu-item" data-link>
					<div class="d-flex align-items-center w-100">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Email-Envelope-Close--Streamline-Pixel" fill="currentColor" height="40" width="40"><desc>Email Envelope Close Streamline Icon: https://streamlinehq.com</desc><title>email-envelope-close</title><g><path d="M22.8525 4.574999999999999H24v14.850000000000001h-1.1475Z"  stroke-width="1"></path><path d="M21.7125 19.424999999999997h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M21.7125 3.4275h1.1400000000000001V4.574999999999999h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 5.715h1.1400000000000001v2.2874999999999996h-1.1400000000000001Z"  stroke-width="1"></path><path d="M2.2874999999999996 20.572499999999998h19.424999999999997v1.1400000000000001H2.2874999999999996Z"  stroke-width="1"></path><path d="M19.424999999999997 17.145h1.1475v1.1400000000000001H19.424999999999997Z"  stroke-width="1"></path><path d="M19.424999999999997 8.0025h1.1475v1.1400000000000001H19.424999999999997Z"  stroke-width="1"></path><path d="M18.285 15.997499999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M18.285 9.1425h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M17.137500000000003 14.857499999999998h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="M17.137500000000003 10.2825h1.1475v1.1475h-1.1475Z"  stroke-width="1"></path><path d="M15.997499999999999 13.7175h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M15.997499999999999 11.43h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M13.71 12.57h2.2874999999999996v1.1475h-2.2874999999999996Z"  stroke-width="1"></path><path d="M10.2825 13.7175h3.4275v1.1400000000000001h-3.4275Z"  stroke-width="1"></path><path d="M7.995 12.57h2.2874999999999996v1.1475h-2.2874999999999996Z"  stroke-width="1"></path><path d="M6.855 13.7175h1.1400000000000001v1.1400000000000001H6.855Z"  stroke-width="1"></path><path d="M6.855 11.43h1.1400000000000001v1.1400000000000001H6.855Z"  stroke-width="1"></path><path d="M5.715 14.857499999999998h1.1400000000000001v1.1400000000000001H5.715Z"  stroke-width="1"></path><path d="M5.715 10.2825h1.1400000000000001v1.1475H5.715Z"  stroke-width="1"></path><path d="M4.5675 15.997499999999999h1.1475v1.1475H4.5675Z"  stroke-width="1"></path><path d="M4.5675 9.1425h1.1475v1.1400000000000001H4.5675Z"  stroke-width="1"></path><path d="M3.4275 17.145h1.1400000000000001v1.1400000000000001H3.4275Z"  stroke-width="1"></path><path d="M3.4275 8.0025h1.1400000000000001v1.1400000000000001H3.4275Z"  stroke-width="1"></path><path d="M2.2874999999999996 2.2874999999999996h19.424999999999997v1.1400000000000001H2.2874999999999996Z"  stroke-width="1"></path><path d="M2.2874999999999996 5.715h1.1400000000000001v2.2874999999999996H2.2874999999999996Z"  stroke-width="1"></path><path d="M1.1400000000000001 19.424999999999997h1.1475v1.1475H1.1400000000000001Z"  stroke-width="1"></path><path d="M1.1400000000000001 3.4275h1.1475V4.574999999999999H1.1400000000000001Z"  stroke-width="1"></path><path d="M0 4.574999999999999h1.1400000000000001v14.850000000000001H0Z"  stroke-width="1"></path></g></svg>
						<div class="ms-3 fs-5 d-lg-block d-none">Chat</div>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ms-auto menu-selector" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M10 20H8V4H10V6H12V9H14V11H16V13H14V15H12V18H10V20Z"/>
					</svg>
					</div>
				</a>
				<div class="fs-3 m-0 d-none mt-sm-auto d-sm-flex align-items-center w-100 menu-item" id="modeSwitch">
						<svg height="40" width="40" xmlns="http://www.w3.org/2000/svg" id="sunIcon"  viewBox="0 0 24 24" id="Weather-Cloud-Sun-Fine--Streamline-Pixel" fill="currentColor" style="display:none"><desc>Weather Cloud Sun Fine Streamline Icon: https://streamlinehq.com</desc><title>weather-cloud-sun-fine</title><g><path d="M22.8525 14.29125H24v4.5675h-1.1475Z"  stroke-width="1"></path><path d="M21.7125 8.57625H24v1.1400000000000001h-2.2874999999999996Z"  stroke-width="1"></path><path d="M21.7125 18.85875h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M21.7125 13.143749999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M21.7125 2.86125h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 20.00625h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 12.00375h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 4.00125h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M2.2874999999999996 21.146250000000002h18.285v1.1400000000000001H2.2874999999999996Z"  stroke-width="1"></path><path d="M15.997499999999999 12.00375h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M15.997499999999999 1.71375h1.1400000000000001v2.2874999999999996h-1.1400000000000001Z"  stroke-width="1"></path><path d="M14.857499999999998 13.143749999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M11.43 4.00125h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M10.2825 2.86125h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="m10.2825 7.428749999999999 3.4275 0 0 1.1475 2.2874999999999996 0 0 1.1400000000000001 1.1400000000000001 0 0 2.2874999999999996 3.435 0 0 -4.574999999999999 -1.1475 0 0 -1.1400000000000001 -1.1400000000000001 0 0 -1.1400000000000001 -3.4275 0 0 1.1400000000000001 -5.715 0 0 1.1400000000000001 -1.1475 0 0 1.1475 2.2874999999999996 0 0 -1.1475z"  stroke-width="1"></path><path d="M7.995 14.29125h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="M6.855 13.143749999999999h1.1400000000000001v1.1475H6.855Z"  stroke-width="1"></path><path d="M6.855 8.57625h1.1400000000000001v1.1400000000000001H6.855Z"  stroke-width="1"></path><path d="m6.855 13.143749999999999 0 -3.4275 -1.1400000000000001 0 0 2.2874999999999996 -3.4275 0 0 1.1400000000000001 4.5675 0z"  stroke-width="1"></path><path d="M1.1400000000000001 20.00625h1.1475v1.1400000000000001H1.1400000000000001Z"  stroke-width="1"></path><path d="M1.1400000000000001 13.143749999999999h1.1475v1.1475H1.1400000000000001Z"  stroke-width="1"></path><path d="M0 14.29125h1.1400000000000001v5.715H0Z"  stroke-width="1"></path></g></svg>
					<svg width="40" height="40" viewBox="0 0 28 30" fill="currentColor" id="moonIcon"
						transform="translate(0, 3)" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M8 2H16V4H14V6H12V4H8V2ZM6 6V4H8V6H6ZM6 16H4V6H6V16ZM8 18H6V16H8V18ZM10 20H8V18H10V20ZM20 20V22H10V20H20ZM22 18V20H20V18H22ZM20 14H22V18H24V10H22V12H20V14ZM14 14V16H20V14H14ZM12 12H14V14H12V12ZM12 12V6H10V12H12Z" />
					</svg>
						<div class="ms-3 fs-5 d-lg-block d-none" id="theme-name"></div>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ms-auto menu-selector" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M10 20H8V4H10V6H12V9H14V11H16V13H14V15H12V18H10V20Z"/>
						</svg>
				</div>
				<a href="/${myUsername.username}/History" class="nav-link d-flex justify-content-lg-start justify-content-center" data-link>
					<div class="d-flex align-items-center w-100 menu-item">
						<div class="profile-img-box position-relative rounded-0"  style="width: 40px; height: 40px;">
							<img src="/assets/profile.png" id="profile-img-nav"
							alt="profile image" class="position-absolute rounded-0 object-fit-cover  profile-img">
						</div>
						<div class="ms-3 fs-5 d-lg-block d-none">Profile</div>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ms-auto menu-selector" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M10 20H8V4H10V6H12V9H14V11H16V13H14V15H12V18H10V20Z"/>
						</svg>
					</div>
				</a>
			</nav>
	`;
    this.render();
    this.setupEventListeners();
  }

  render() {
    super.render();
    const profileImg = document.getElementById("profile-img-nav");
    let imgPath = "assets/profile.png";
    fetch(`https://${location.host}:9000/user/getotherinfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
		"Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({ username: myUsername.username })
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.image) imgPath = data.image;
		const timestamp = new Date().getTime();
        profileImg.src = `http://${location.host}/image/${imgPath}?${timestamp}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  setupEventListeners() {
    const themeName = document.getElementById("theme-name");
    setupDarkModeToggle(themeName);
  }
}
