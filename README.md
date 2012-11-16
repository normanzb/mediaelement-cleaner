_MediaElement Cleaner_
 * Expand MediaElementPlayer class, add dispose() method which allows you properly
 remove media element from DOM tree, delete the reference in mejs.players 
 * Automatically call to dispose method when audio player is removed from dom tree.