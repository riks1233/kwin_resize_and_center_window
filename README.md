# KWin resize and center window

A keyboard shortcut for KDE Wayland Plasma 6 Window Management to resize the current active window to 2/3 of the current screen's size and center it on the current screen. This resizes the window to the 16:9 aspect ratio based on current screen's smallest size (either width or height).

# Installation

- Download the code repository and move it into the required kwin directory:

  ```bash
  git clone https://github.com/riks1233/kwin_resize_and_center_window.git
  mkdir -p ~/.local/share/kwin/scripts
  mv kwin_resize_and_center_window ~/.local/share/kwin/scripts/.
  ```
- KDE System Settings app -> search and select "KWin Scripts" (will be under the Window Management section) -> enable the `Resize And Center Active Window` entry (which should now be here due to copying to `~/.local/share/kwin/scripts/.`).
- KDE System Settings app -> search and select "Shortcuts" (will be under the Keyboard section) -> Window Management -> configure your desired shortcut for the `Resize And Center Active Window` entry.
- Enjoy!

# Modifying the default sizes

- Change the value in the `contents/code/main.js` in "configuration area":
  - for `coefficient`, the value should be a float in range [0 ... 1].
  - for width and height aspect ratios choose any numeric values not less than 1.
- Disable (press apply) and re-enable (press apply) the plugin in KDE System Settings -> Window Management -> KWin Scripts.

# Behavior debugging in specific apps/windows

- Try running `journalctl -f QT_CATEGORY=js QT_CATEGORY=kwin_scripting` in a terminal and then activate the shortcut on your app/window. Look in the terminal window if you see anything suspicious.

# Useful links

- https://develop.kde.org/docs/plasma/kwin/
