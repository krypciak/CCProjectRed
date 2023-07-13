import '../ui/submenu.js';

sc.NewGameModeDialogButton.inject({
  alyGfx: new ig.Image('media/gui/new-game-aly.png'),
  init(title, data) {
    // Just let it do its thing...
    this.parent(title, data);

    if (this.data === 2) {
      // Any better way to do it than this?
      this.removeChildGui(this.image);
      this.image = new ig.ImageGui(this.alyGfx, 0, 0, 110, 90);
      this.image.setPos(5, 19);
      this.addChildGui(this.image);
    }
  },
});

sc.NewGameModeSelectDialog.inject({
  explore: null,
  init(callback) {
    this.parent(callback);

    ig.lang.labels.sc.gui.menu['new-game'].dialogs.explore = 'Explore';
    ig.lang.labels.sc.gui.menu['new-game'].dialogs.exploreDescription =
      'Explore the world of Shadoon.';

    this.explore = new sc.NewGameModeDialogButton(
      ig.lang.get('sc.gui.menu.new-game.dialogs.explore'),
      2,
    );
    this.explore.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
    this.explore.setPos(0, 27);
    this.explore.data = 2;

    this.content.addChildGui(this.explore);
    this.buttongroup.addFocusGui(this.explore, 2, 0);

    this.content.setSize(400, 200);
    this.info.setMaxWidth(394);
    this.msgBox.resize();

    for (const child of this.content.hook.children) {
      if (child.gui instanceof sc.LineGui) {
        child.gui.hook.size.x = 400;
      }
    }

    this.buttongroup.addSelectionCallback((info) => {
      if (!(info instanceof sc.ButtonGui)) return;
      if (info.data === 2) {
        this.info.doStateTransition('DEFAULT', true);
        this.info.setText(ig.lang.get('sc.gui.menu.new-game.dialogs.exploreDescription'));
      }
    });
    this.buttongroup.addPressCallback((info) => {
      if (!(info instanceof sc.ButtonGui)) return;
      if (info.data === 2) {
        sc.menu.setDirectMode(true, sc.MENU_SUBMENU.EXPLORE);
        sc.menu.optionsLocalMode = true;
        sc.model.enterMenu(true);
      }
    });
  },
});
