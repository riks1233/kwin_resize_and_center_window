
/* Debugging information:
*
* code editor and tester: plasma-interactiveconsole --kwin
* root stuff: /usr/share/kwin-wayland/scripts
* regular user stuff: ~/.local/share/kwin/scripts/.
* see logs: journalctl -f QT_CATEGORY=js QT_CATEGORY=kwin_scripting
*
*/

// Configuration area.

// Coefficient is the percentage of current screen size that the window size would become.
// Default is 2/3 (two-thirds);
const coefficient = 0.67;
// Aspect ratios of the new window size for width : height. Default is 16:9.
const widthAspectRatio = 16;
const heightAspectRatio = 9;

// End of configuration area.

const main = () => {
    if (coefficient < 0 || coefficient > 1) {
      print("Coefficient variable has a wrong value, should a float value in range [0 ... 1]");
      return;
    }

    if (widthAspectRatio < 1) {
      print("widthAspectRatio must not be less than 1");
      return;
    }

    if (heightAspectRatio < 1) {
      print("heightAspectRatio must not be less than 1");
      return;
    }

    if (workspace.activeWindow.fullScreen || workspace.activeWindow.noBorder) {
      print("Either fullscreen or borderless, not centering window.");
      return;
    }

    if (!workspace.activeWindow.resizeable) {
      print("Window is not resizeable for some reason, not centering window.");
      return;
    }

    function cloneObject(obj) {
        const copy = Object.create(Object.getPrototypeOf(obj));
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = cloneObject(obj[key]);
            }
        }
        return copy;
    }

    // Goal and calculation logic explanation:
    // I want to set the size of the active window to 2/3 of the current screen and place it in the center.
    // The new width should be based on the monitor height (so that ultrawide monitors have adequate window size).
    // And the new window should be of 16:9 aspect ratio.
    // I have x, y (top-left corner position of the window), its width and height.
    // What do:
    // * height would be: screen_height * coefficient, which is 2/3.
    // * width would be: new_height * 16 / 9.
    // * position x: `screen_x + screen_width / 2 - window_width / 2`. And same for position y.
    //   Explanation:
    //     * screen_x: screen's own position. If you have two FHD (1920 x 1080) screens and you're on the right one, right one's x position will start at 1920, not 0.
    //     * screen_width / 2: middle of the screen.
    //     * window_width / 2: middle of the window.
    const desiredGeometry = cloneObject(workspace.activeWindow.frameGeometry);
    const isScreenHorizontal = workspace.activeScreen.geometry.width > workspace.activeScreen.geometry.height;
    if (isScreenHorizontal) {
      desiredGeometry.height = workspace.activeScreen.geometry.height * coefficient;
      desiredGeometry.width = desiredGeometry.height * widthAspectRatio / heightAspectRatio;
    } else {
      desiredGeometry.width = workspace.activeScreen.geometry.width * coefficient;
      desiredGeometry.height = desiredGeometry.width * heightAspectRatio / widthAspectRatio;
    }
    desiredGeometry.x = workspace.activeScreen.geometry.x + (workspace.activeScreen.geometry.width / 2) - (desiredGeometry.width / 2)
    desiredGeometry.y = workspace.activeScreen.geometry.y + (workspace.activeScreen.geometry.height / 2) - (desiredGeometry.height / 2)

    // workspace.activeWindow.maximizeMode
    // * 0 = floating window.
    // * 1 = no idea if such even exists.
    // * 2 = no idea if such even exists.
    // * 3 = maximized window (not related to fullscreen at all).
    if (workspace.activeWindow.maximizeMode != 0) {
        // Try maximize window if it is not yet a floating window.
        workspace.slotWindowMaximize(workspace.activeWindow);
    }
    try {
        // Works but throws an error and the program doesn't execute any further; so have to ignore error with try-catch.
        workspace.activeWindow.frameGeometry = desiredGeometry;
    } catch (err) {
        print("Caught an EXPECTED error, all good, ignoring and continuing execution.");
    }
}

registerShortcut("ResizeAndCenterActiveWindow", "Resize And Center Active Window", null, main);
