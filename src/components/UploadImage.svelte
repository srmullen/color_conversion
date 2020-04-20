<style type="text/scss">
  @import '../styles.scss';

  label {
		padding: 10px;
		color: #fff;
		font-family: 'Courier New', Courier, monospace;
		font-weight: 550;
		letter-spacing: 0.3px;
		font-size: 14px;
		display: block;
		cursor: pointer;
		input[type=file] {
			display: none;
		}
		&:hover {
			background-color: lighten($color: $primary-color, $amount: 5);
			opacity: 0.7;
		}
	}
</style>

<script>
  export let onLoad = () => {};

  function onChange() {
    if (this.files && this.files[0]) {
      var img = document.querySelector('img');  // $('img')[0]
      img.src = URL.createObjectURL(this.files[0]); // set src to blob url
      img.hidden = true;
      img.onload = () => {
        onLoad(img);
      };
      img.onerror = onerror;
      document.body.appendChild(img);
    }
  }
</script>

<div>
  <label class="bg-red">
    Choose Image
    <input type="file" on:change="{onChange}" />
  </label>
</div>