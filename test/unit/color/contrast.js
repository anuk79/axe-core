describe('color.Color', function () {
	'use strict';

	it('should set values properly via RGB', function () {
		var c = new kslib.color.Color();
		c.parseRgbString('rgb(17, 34, 51)');
		assert.equal(c.red, 17);
		assert.equal(c.green, 34);
		assert.equal(c.blue, 51);
		assert.equal(c.alpha, 1);
	});

	it('should set values properly via RGBA', function () {
		var c = new kslib.color.Color();
		c.parseRgbString('rgba(17, 34, 51, 0)');
		assert.equal(c.red, 17);
		assert.equal(c.green, 34);
		assert.equal(c.blue, 51);
		assert.equal(c.alpha, 0);
	});

	it('should calculate luminance sensibly', function () {
		var black = new kslib.color.Color(0, 0, 0, 1);
		var white = new kslib.color.Color(255, 255, 255, 1);
		var yellow = new kslib.color.Color(255, 255, 0, 1);
		var darkyellow = new kslib.color.Color(128, 128, 0, 1);
		var blue = new kslib.color.Color(0, 0, 255, 1);
		var lBlack = black.getRelativeLuminance();
		var lWhite = white.getRelativeLuminance();
		var lYellow = yellow.getRelativeLuminance();
		var lDarkyellow = darkyellow.getRelativeLuminance();
		var lBlue = blue.getRelativeLuminance();

		//values range from zero to one
		assert.equal(lBlack, 0);
		assert.equal(lWhite, 1);

		//brighter values are more luminant than darker ones
		assert.isTrue(lWhite > lYellow);
		assert.isTrue(lYellow > lDarkyellow);
		assert.isTrue(lYellow > lBlue);
		assert.isTrue(lBlue > lBlack);
	});

	it('should calculate contrast sensibly', function () {
		var black = new kslib.color.Color(0, 0, 0, 1);
		var transparent = new kslib.color.Color(0, 0, 0, 0);
		var white = new kslib.color.Color(255, 255, 255, 1);
		var yellow = new kslib.color.Color(255, 255, 0, 1);

		//Same foreground/background gives 1
		assert.equal(kslib.color.getContrast(black, black), 1);
		assert.equal(kslib.color.getContrast(transparent, black), 1);
		assert.equal(kslib.color.getContrast(white, white), 1);
		assert.equal(kslib.color.getContrast(yellow, yellow), 1);

		//contrast ratio is reversible
		assert.equal(kslib.color.getContrast(yellow, black), kslib.color.getContrast(black, yellow));
		assert.equal(kslib.color.getContrast(yellow, white), kslib.color.getContrast(white, yellow));

		//things that are more contrasty return higher values than things that are less contrasty
		assert.isTrue(kslib.color.getContrast(yellow, white) < kslib.color.getContrast(yellow, black));
		assert.isTrue(kslib.color.getContrast(yellow, black) < kslib.color.getContrast(white, black));
	});

	it('should flatten colors properly', function () {
		var halfblack = new kslib.color.Color(0, 0, 0, 0.5);
		var fullblack = new kslib.color.Color(0, 0, 0, 1);
		var transparent = new kslib.color.Color(0, 0, 0, 0);
		var white = new kslib.color.Color(255, 255, 255, 1);
		var gray = new kslib.color.Color(127.5, 127.5, 127.5, 1);
		var flat = kslib.color.flattenColors(halfblack, white);
		assert.equal(flat.red, gray.red);
		assert.equal(flat.green, gray.green);
		assert.equal(flat.blue, gray.blue);

		var flat2 = kslib.color.flattenColors(fullblack, white);
		assert.equal(flat2.red, fullblack.red);
		assert.equal(flat2.green, fullblack.green);
		assert.equal(flat2.blue, fullblack.blue);

		var flat3 = kslib.color.flattenColors(transparent, white);
		assert.equal(flat3.red, white.red);
		assert.equal(flat3.green, white.green);
		assert.equal(flat3.blue, white.blue);
	});

	it('should give sensible results for WCAG compliance', function () {
		var black = new kslib.color.Color(0, 0, 0, 1);
		var white = new kslib.color.Color(255, 255, 255, 1);
		var gray = new kslib.color.Color(128, 128, 128, 1);

		assert.isTrue(kslib.color.hasValidContrastRatio(black, white, 16, true));
		assert.isFalse(kslib.color.hasValidContrastRatio(black, black, 16, true));
		assert.isTrue(kslib.color.hasValidContrastRatio(white, gray, 24, false));
		assert.isTrue(kslib.color.hasValidContrastRatio(white, gray, 20, true));
		assert.isFalse(kslib.color.hasValidContrastRatio(white, gray, 8, false));
	});

});
