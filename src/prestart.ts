// Patches to internals {{{
    import './patches/crosscode.js';
    import './patches/new-game.js';
// }}}

// UI stuff {{{
    // This one isn't really needed right now... we already hook into the new
    // game plus menu and the "start game" text doesn't really have to be
    // overridden
    // Keeping for posterity though! The injections might be helpful for readers
    // of the source code
    // import './ui/title-screen.js';
// }}}
