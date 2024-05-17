import { Component } from "../library/component.js";

export class Home extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="w-100 h-100" id="game-container">
	<div class="bg-black d-flex flex-column flex-xl-row justify-content-between position-relative"
		id="game-field">
		<div class="position-relative player-axis">
			<div class="bg-white rounded-2 paddle position-absolute" id="player-one"></div>
		</div>
		<div class="bg-white opacity-25 position-relative" id="separator">
			<div class="fs-1 position-absolute" id="score-one">00</div>
			<div class="fs-1 position-absolute" id="score-two">00</div>
			<div class="fs-4 position-absolute" id="name-one">player1</div>
			<div class="fs-4 position-absolute" id="name-two">player2</div>
		</div>
		<div class="bg-white rounded-circle position-absolute" id="ball"></div>
		<div class="position-relative player-axis">
			<div class="bg-white rounded-2 paddle position-absolute" id="player-two"></div>
		</div>
		<table class="text-success position-absolute opacity-75" id="debug-info">
			<thead>
				<tr>
					<th></th>
					<th class="text-danger">Server</th>
					<th>Local</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>fieldX: </th>
					<td class="text-danger" id="fieldXServer"></td>
					<td id="fieldX"></td>
				</tr>
				<tr>
					<th>fieldY: </th>
					<td class="text-danger" id="fieldYServer"></td>
					<td id="fieldY"></td>
				</tr>
				<tr>
					<th>pos1: </th>
					<td class="text-danger" id="pos1Server"></td>
					<td id="pos1"></td>
				</tr>
				<tr>
					<th>pos2: </th>
					<td class="text-danger" id="pos2Server"></td>
					<td id="pos2"></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
	`;
    this.render();
  }
}
