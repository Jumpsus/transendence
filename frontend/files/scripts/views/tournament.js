import { Component } from "../library/component.js";
import { username } from "../utils/router.js";
import { host } from "../../index.js";

export class Tournament extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div class="w-100 h-100 d-flex justify-content-center align-items-center">
	<div
		class="d-flex justify-content-center align-items-xl-center align-items-stretch flex-column flex-xl-row gap-3 tournament-table">
		<div class="quarters-section d-flex flex-column gap-3 position-relative pb-xl-0 pb-3">
			<div class="tournament-label position-absolute">1/4</div>
			<div class="quarters-half d-flex flex-xl-column flex-row gap-3">
				<div class="vs-card">
					<div class="contestant-card d-flex align-items-center">
						<div class="profile-img-box position-relative" style="height: 100%; aspect-ratio: 1/1;"><img class="position-absolute object-fit-cover profile-img" src="https://${host}/image/${
      username.username
    }.png?t=${new Date().getTime()}"></div>
						<div class="card-right-section d-flex justify-content-between">
							<div class="user-name">contestant</div>
							<div class="d-flex align-items-center">69%</div>
						</div>
					</div>
					<div class="contestant-card d-flex align-items-center">
					<div class="profile-img-box position-relative" style="height: 100%; aspect-ratio: 1/1;"><img class="position-absolute object-fit-cover profile-img" src="https://${host}/image/${
						username.username
					  }.png?t=${new Date().getTime()}"></div>
					<div class="card-right-section d-flex justify-content-between">
						<div class="user-name">contestant</div>
						<div class="d-flex align-items-center">69%</div>
					</div>
					</div>
				</div>
				<div class="vs-card">
					<div class="contestant-card d-flex align-items-center">
						<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
					</div>
					<div class="contestant-card d-flex align-items-center">
						<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
					</div>
				</div>
			</div>
			<div class="quarters-half d-flex flex-xl-column flex-row gap-3">
				<div class="vs-card ">
					<div class="contestant-card d-flex align-items-center">
						<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
					</div>
					<div class="contestant-card d-flex align-items-center">
						<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
					</div>
				</div>
				<div class="vs-card ">
					<div class="contestant-card d-flex align-items-center"><div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div></div>
					<div class="contestant-card d-flex align-items-center"><div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div></div>
				</div>
			</div>
		</div>
		<div class="semifinals-section d-flex flex-xl-column flex-row gap-3 position-relative pb-xl-0 pb-3">
			<div class="tournament-label position-absolute">1/2</div>
			<div class="vs-card ">
				<div class="contestant-card d-flex align-items-center">
				<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
				</div>
				<div class="contestant-card d-flex align-items-center">
				<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
				</div>
			</div>
			<div class="vs-card ">
				<div class="contestant-card d-flex align-items-center">
				<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
				</div>
				<div class="contestant-card d-flex align-items-center">
				<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
				</div>
			</div>
		</div>
		<div class="finals-section position-relative">
			<div class="tournament-label position-absolute">finals</div>
			<div class="vs-card  d-flex flex-xl-column flex-row gap-3">
				<div class="contestant-card d-flex align-items-center">
				<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
				</div>
				<div class="contestant-card d-flex align-items-center">
				<div class="d-flex justify-content-center w-100 h-100 align-items-center">???</div>
				</div>
			</div>
		</div>
		<div class="prize-section d-flex justify-content-center">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
				id="Interface-Essential-Trophy--Streamline-Pixel" fill="currentColor" height="40" width="40">
				<g>
					<path d="M22.28625 4.005h1.1400000000000001v5.7075000000000005h-1.1400000000000001Z"
						stroke-width="1"></path>
					<path
						d="m19.99875 4.005 2.2874999999999996 0 0 -1.1475 -2.2874999999999996 0 0 -1.1400000000000001 -1.1400000000000001 0 0 11.43 1.1400000000000001 0 0 -2.2874999999999996 2.2874999999999996 0 0 -1.1475 -2.2874999999999996 0 0 -5.7075000000000005z"
						stroke-width="1"></path>
					<path d="M17.71125 13.1475h1.1475v1.1400000000000001h-1.1475Z" stroke-width="1"></path>
					<path
						d="M16.57125 14.287500000000001h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
						stroke-width="1"></path>
					<path
						d="m7.428749999999999 22.29 0 -1.1475 -1.1400000000000001 0 0 1.1475 -1.1475 0 0 1.1400000000000001 13.7175 0 0 -1.1400000000000001 -1.1475 0 0 -1.1475 -1.1400000000000001 0 0 1.1475 -9.1425 0z"
						stroke-width="1"></path>
					<path
						d="M14.283750000000001 20.0025h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"
						stroke-width="1"></path>
					<path d="M14.283750000000001 15.4275h2.2874999999999996v1.1475h-2.2874999999999996Z"
						stroke-width="1"></path>
					<path
						d="m13.143749999999999 6.285 0 -2.2800000000000002 -2.2874999999999996 0 0 2.2800000000000002 -3.4275 0 0 1.1475 1.1400000000000001 0 0 1.1400000000000001 1.1475 0 0 1.1400000000000001 -1.1475 0 0 2.2874999999999996 2.2874999999999996 0 0 -1.1400000000000001 2.2874999999999996 0 0 1.1400000000000001 2.2874999999999996 0 0 -2.2874999999999996 -1.1475 0 0 -1.1400000000000001 1.1475 0 0 -1.1400000000000001 1.1400000000000001 0 0 -1.1475 -3.4275 0z"
						stroke-width="1"></path>
					<path
						d="M13.143749999999999 16.575000000000003h1.1400000000000001v3.4275h-1.1400000000000001Z"
						stroke-width="1"></path>
					<path d="M9.71625 16.575000000000003h1.1400000000000001v3.4275h-1.1400000000000001Z"
						stroke-width="1"></path>
					<path
						d="M7.428749999999999 20.0025h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"
						stroke-width="1"></path>
					<path d="M7.428749999999999 15.4275h2.2874999999999996v1.1475h-2.2874999999999996Z"
						stroke-width="1"></path>
					<path
						d="M6.28875 14.287500000000001h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
						stroke-width="1"></path>
					<path d="M5.14125 0.5700000000000001h13.7175v1.1475H5.14125Z" stroke-width="1"></path>
					<path d="M5.14125 13.1475h1.1475v1.1400000000000001h-1.1475Z" stroke-width="1"></path>
					<path
						d="m5.14125 1.7175 -1.1400000000000001 0 0 1.1400000000000001 -2.2874999999999996 0 0 1.1475 2.2874999999999996 0 0 5.7075000000000005 -2.2874999999999996 0 0 1.1475 2.2874999999999996 0 0 2.2874999999999996 1.1400000000000001 0 0 -11.43z"
						stroke-width="1"></path>
					<path d="M0.57375 4.005h1.1400000000000001v5.7075000000000005H0.57375Z" stroke-width="1">
					</path>
				</g>
			</svg>
		</div>
	</div>
</div>
	`;
    this.render();
  }
}
