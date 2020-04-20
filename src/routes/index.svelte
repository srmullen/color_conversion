<style type="text/scss">
	@import '../styles.scss';
	
	body {
		background-color: $body-color;
		margin: 0;
		padding: 0;
		font-family: 'Courier New', Courier, monospace;
	}

	nav {
		font-size: 20px;
		position: relative;
		z-index: 10;
		text-align: center;
		align-items: center;
		width: 100%;

		.links {
			float: right;
		}

		button {
			width: 80px;
			text-decoration: none;
			padding: 5px 15px;
			margin: 10px;
			border: 1px solid darkgray;
			color: darkgray;
			font-weight: 700;
			font-size: 20px;
			letter-spacing: 1.2px;
			font-family: 'Courier New', Courier, monospace;
			cursor: pointer;
			outline: none;

			&.active {
				span {
					opacity: 0.7;
				}
				color: white;
				background-color: $blue;
			}
		}
	}

	h1 {
		letter-spacing: 0.4px;
		font-weight: 600;
		text-transform: uppercase;
		display: inline;

		&.title {
			font-size: 1.7em;
			margin: 0 20px 0 0;
		}
	}

	p {
		font-family: 'Courier New', Courier, monospace;
		font-weight: 700;
		line-height: 1.2em;
		letter-spacing: 0.2px;
		opacity: 0.7;
	}

	.bg-red {
		background-color: $primary-color;
	}

	.bg-green {
		background-color: $green;
	}

	.bg-blue {
		background-color: $blue;
	}

	#gui {
		position: absolute;
		left: 50px;
		z-index: 10;
	}

	.container {
		position: relative;
		padding-top: $top-padding;
		margin-left: 50px;
		display: grid;
		grid-template-columns: 70% 20px 25%;
		grid-template-rows: 150px auto 70px auto;
		max-height: 90vh;
		
		.row0 {
			grid-row: 1;
			max-width: 1000px;
		}

		.button-row {
			grid-row: 3;
			max-width: 1000px;
			.buttons {
				div {
					margin-bottom: 5px;
				}
				padding-top: 20px;
				width: 400px;
				display: flex;
				justify-content: space-between;  
				flex-wrap: wrap;
			}
		}

		.row2 {
			// max-width: 1000px;
			grid-row: 2;
		}
	}

	#controls {
		position: relative;
		border: 1px solid lightgray;
		border-radius: 5px;
		margin: 40px 0;
		min-width: 230px;
		padding: 10px;
		grid-row: 2;
		grid-column: 3;
	}

	.btn {
		border: none;
		border-radius: 0;
		padding: 10px;
		color: #fff;
		font-family: 'Courier New', Courier, monospace;
		font-weight: 550;
		letter-spacing: 0.3px;
		font-size: 14px;
		&.bg-red {
			&:hover {
				background-color: lighten($color: $primary-color, $amount: 5);
				opacity: 0.7;
			}
		}

		&.bg-green {
			&:hover {
				background-color: lighten($color: $green, $amount: 5);
				opacity: 0.7;
			}
		}

		&.bg-blue {
			&:hover {
				background-color: lighten($color: $blue, $amount: 5);
				opacity: 0.7;
			}
		}
	}

	@media screen and (max-width: 990px) {
		#controls {
			grid-row: 4;
			grid-column: 1;
			width: 100%;
			max-width: none;
		}

		.links {
			button {
				display: block;
			}
		}
	}

	@media screen and (max-width: 600px) {
		.container {
			.row0 {
				grid-row: 2;
				grid-column: 3;
			}

			.button-row {
				.buttons {
					width: 250px;
				}
			}
		}

		.links {
			button {
				font-size: 14px;
			}
		}
	}
</style>

<script>
	import { GPU } from 'gpu.js';
	import { onMount } from 'svelte';
	import throttle from 'lodash.throttle';
	import queryString from 'query-string';
	import { setupRGBKernel , setupHSVKernel, setupCMYKKernel } from './_kernelSetup';
	import { createCanvas, saveImage, uploadImage, removeElement, randomImage, setupHSVGui } from '../utils';
	import UploadImage from '../components/UploadImage';

	let kernel, gui, onChange;

	const RGB = 'rgb';
	const HSV = 'hsv';
	const CMYK = 'cmyk';

	function createRGBParams() {
		return {
			red: 1,
			green: 1,
			blue: 1
		};
	}

	function createHSVParams() {
		return {
			hue: 0,
			saturation: 1,
			value: 1
		};
	}

	function createCMYKParams() {
		return {
			cyan: 1,
			yellow: 1,
			magenta: 1,
			key: 1
		};
	}

	const rgbParams = createRGBParams();
  const hsvParams = createHSVParams();
	const cmykParams = createCMYKParams();

	let mode = RGB;

	function changeMode(newMode) {
		mode = newMode;
		setQuery({ mode });
	}

	let setup = () => {}

	function setQuery(query) {
		if (history.pushState) {
			const url = `${window.location.origin}${window.location.pathname}?${queryString.stringify(query)}`;
			window.history.pushState({ path: url }, '', url);
		}
	}

	function setupKernel(mode, image) {
		if (mode === RGB) {
			return setupRGBKernel(image);
		} else if (mode === HSV) {
			return setupHSVKernel(image);
		} else if (mode === CMYK) {
			return setupCMYKKernel(image);
		} else {
			throw new Error('No color mode defined');
		}
	}

	function getModeFromQuery() {
		const { mode } = queryString.parse(window.location.search);

		if (!mode) {
			return RGB;
		} else if (mode.toLowerCase() === RGB) {
			return RGB
		} else if (mode.toLowerCase() === HSV) {
			return HSV;
		} else if (mode.toLowerCase() === CMYK) {
			return CMYK;
		}
	}

	let onUpload = () => {};
	let onRandomClick = () => {};
	let onDownloadClick = () => {};

	onMount(async () => {
		const { setupRGBGui, setupCMYKGui, setupHSVGui } = await import('./_guiSetup');

		function setupGui(mode, kernel, params) {
			if (mode === RGB) {
				return setupRGBGui(kernel, params);
			} else if (mode === HSV) {
				return setupHSVGui(kernel, params);
			} else if (mode === CMYK) {
				return setupCMYKGui(kernel, params);
			} else {
				throw new Error('No color mode defined');
			}
		}

		function getParams(colorMode) {
			if (colorMode === RGB) {
				return rgbParams;
			} else if (colorMode === HSV) {
				return hsvParams;
			} else if (colorMode === CMYK) {
				return cmykParams;
			} else {
				throw new Error('No color mode defined');
			}
		}

		// let mode = getModeFromQuery();
		let image = await randomImage();

		function setImage(img) {
			rgbParams.image = img;
			hsvParams.image = img;
			cmykParams.image = img;
		}

		function onKernelChange() {
			if (kernel) {
				removeElement(kernel.canvas);
			}
			if (gui) {
				gui.destroy();
				removeElement(gui.domElement);
			}
		}

		setImage(image);

		setup = (mode) => {
			onKernelChange();
			const params = getParams(mode);
			kernel = setupKernel(mode, params.image);
			[gui, onChange] = setupGui(mode, kernel, params);
			onChange();
		}

		setup(mode);

		onUpload = (img) => {
			setImage(img);
			onKernelChange();
			kernel = setupKernel(mode, image);
			[gui, onChange] = setupGui(mode, kernel, getParams(mode));
			onChange();
		}

		onRandomClick = async () => {
			const image = await randomImage();
			setImage(image);
			onKernelChange();
			kernel = setupKernel(mode, image);
			[gui, onChange] = setupGui(mode, kernel, getParams(mode));
			onChange();
		}

		onDownloadClick = () => {
			saveImage(kernel.canvas);
		}
	});
</script>

<svelte:head>
	<title>Color Conversion</title>
</svelte:head>

<div id="gui"></div>
<div class="container">
	<div class="row0">
		<nav>
			<div class="links">
				<button 
					on:click="{() => {
						changeMode(RGB);
						setup(RGB);
					}}" 
					class="{mode === RGB ? 'active' : ''}">
					RGB
				</button>
				<button 
					on:click="{() => {
						changeMode(HSV);
						setup(HSV);
					}}"
					class="{mode === HSV ? 'active' : ''}">
					HSV
				</button>
				<button 
					on:click="{() => {
						changeMode(CMYK);
						setup(CMYK);
					}}"
					class="{mode === CMYK ? 'active' : ''}">
					CMYK
				</button>
			</div>
		</nav>
	</div>
	<div class="button-row">
		<div class="buttons">
			<UploadImage onLoad="{onUpload}" />
			<div>
				<button class="btn primary bg-green" on:click="{onRandomClick}">Random Image</button>
			</div>
			<div>
				<button class="btn primary bg-blue" on:click="{onDownloadClick}">Download</button>
			</div>
		</div>
	</div>
	<div class="row2">
		<div id="canvas-container"></div>
	</div>
	<div id="controls">
		<div>
			<h1>About</h1>
			<a href="https://twitter.com/srmullen?ref_src=twsrc%5Etfw" class="twitter-follow-button"
				data-show-count="false">Follow
				@srmullen</a>
			<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		</div>
		<p>
			This is a demonstration of the code discussed in this article.
		</p>
		<a href="https://medium.com/@srmullen13/notorious-rgb-756f19f3e462">Color Models</a>
		<p>
			Photographs can be edited based on the RGB, HSV, and CMYK color models.
		</p>
		<p>
			RGB = Red Green Blue.<br />
			HSV = Hue Saturation Value.<br />
			CMYK = Cyan Magenta Yellow Key.<br />
		</p>
	</div>
</div>