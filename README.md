# rFactor 2 Overlay

<p align="center">
	<img  alt="Ninja Labs" src="https://i.imgur.com/bCvPZQF.png" width="200">
	&nbsp;
	<img  alt="rFactor 2" src="https://www.studio-397.com/wp-content/uploads/2016/09/logo_rf2_blue-red.png" width="150">
</p>

Built using Angular 7. This app uses an rFactor 2 REST API to fetch session info and provide a stream overlay. It currently uses an unreleased REST API client so breaking changes are likely once fully released.

<p align="center">
	<img  alt="Overlay" src="https://i.imgur.com/HrNJljr.jpg" width="900" >
</p>

## Stream Setup

This has only been tested with OBS. To use other streaming software, you'll need to find a way to overlay a web page in your stream. The following instructions assume you already have OBS installed.

### OBS

1. Download and follow the install instructions for the OBS Browser Plugin [here](https://obsproject.com/forum/resources/browser-plugin.115/)
   (This lets us add a web page as a source in OBS)
2. In OBS, add a new source and select **BrowserSource**.
3. Right click on the source and select **Properties**
4. Set the following
   - **URL**: http://localhost:5397/webdev/index.html
   - **Width**: 1920
   - **Height**: 1080
   - **FPS**: 30

### Build Overlay

- To build, simply run `npm run build` (This will create a dist folder with all the compiled files)
- Create a folder called `webdev` inside your rFactor 2 install
- Move the compiled files to the `webdev` folder

### rFactor 2

Currently, rFactor does not expose the REST API needed for the overlay to work.

Copy the **net.rfactor2.webdev.jar** plugin in this repo in to your `Bin/Bundles` within your rFactor 2 install. This will expose session data to the overlay and creates a webserver that serves the `webdev` folder mentioned above.

## Development Setup

### Prerequisites

You must have NodeJS and Angular CLI installed on your machine.
Run `node -v` and `npm -v` to make sure this is the case. You can install a Node LTS version [here](https://nodejs.org/en/)

Clone the repo and go to the project folder e.g. `cd Documents/Projects/rfactor-2-overlay`
Then run the following commands

```sh
npm install
```

## License

MIT
