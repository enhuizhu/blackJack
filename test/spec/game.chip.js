"use strict";

describe("test functions under game.chip space", function() {
	it("test chip total", function() {
		game.chip.chipArr = [5,10];
		game.chip.bankerChipArr = [5,10];

		expect(game.chip.getChipTotal()).toBe(30);

		game.chip.bankerChipArr = [5,10,10];

		expect(game.chip.getChipTotal()).toBe(40);

	});
});