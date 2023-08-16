sc.ExploreMenuButtonGui = ig.GuiElementBase.extend({
  buttongroup: null,
  offset: 0,
  spacing: 0,
  maxHeight: 0,

  init(spacing?: number) {
    this.parent();

    this.spacing = spacing || 5;

    this.buttongroup = new sc.ButtonGroup();
  },
  pushButton(button: ig.FocusGui) {
    // Increase the max height to correct the sizing to fit the children
    this.maxHeight = Math.max(this.maxHeight, button.hook.size.y);

    // If this isn't the first button, increase the left offset by the spacing
    if (this.hook.children.length !== 0) {
      this.offset += this.spacing;
    }

    // Set the button position according to the offset determined by the previous buttons
    button.setPos(this.offset, 0);
    this.offset += button.hook.size.x;

    // Add the button and set the size of this element to fit the children
    this.addChildGui(button);
    this.setSize(this.offset, this.maxHeight);

    // Set the focus UI Index to the X "coordinate" of the element, Y always 0
    this.buttongroup.addFocusGui(button, this.hook.children.length - 1, 0);
  },

  pushButtons(buttons: ig.FocusGui[]) {
    for (let i = 0; i < buttons.length; i++) {
      this.pushButton(buttons[i]);
    }
  },
});


let titleScreenButtonGuiInstance: sc.TitleScreenButtonGui
sc.TitleScreenButtonGui.inject({
  init() {
    titleScreenButtonGuiInstance = this
    return this.parent();
  },
});

sc.ExploreMenu = sc.BaseMenu.extend({
  buttons: null,
  init() {
    this.parent();
    this.setSize(ig.system.width, ig.system.height);

    // Initialize our button GUI component
    this.buttons = new sc.ExploreMenuButtonGui();
    this.buttons.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_BOTTOM);
    this.buttons.setPos(0, 5);

    // Wrapper structuring
    this.content = new ig.GuiElementBase();
    this.msgBox = new sc.CenterBoxGui(this.content);
    this.msgBox.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_CENTER);

    // Textual content sizing
    let text = new sc.TextGui(ig.lang.get('sc.gui.menu.project-red.introduction'));
    text.setAlign(ig.GUI_ALIGN.X_CENTER, ig.GUI_ALIGN.Y_TOP);
    text.setTextAlign(ig.Font.ALIGN.CENTER);


    // Create the buttons and assign their invocation callbacks
    let startButton = new sc.ButtonGui(ig.lang.get('sc.gui.menu.project-red.buttons.start'));
    let githubButton = new sc.ButtonGui(ig.lang.get('sc.gui.menu.project-red.buttons.github'));
    startButton.onButtonPress = this.onBeginButtonPress;
    githubButton.onButtonPress = this.onGitButtonPress;

    // Push the buttons to the button container
    this.buttons.pushButtons([startButton, githubButton]);

    // Add content
    this.content.addChildGui(text);
    this.content.addChildGui(this.buttons);

    // Set wrapper container to fit text content width (ignoring height)
    let textWidth = text.hook.size.x;
    let textHeight = text.hook.size.y;
    this.msgBox.setSize(textWidth + 20, textHeight + 20 + this.buttons.hook.size.y);
    this.content.setSize(textWidth + 10, textHeight + 10 + this.buttons.hook.size.y);

    // Resize to correct left+right border heights and bg
    this.msgBox.resize();

    this.addChildGui(this.msgBox);

    this.doStateTransition('DEFAULT', true);
  },

  showMenu() {
    this.addObservers();

    sc.menu.buttonInteract.pushButtonGroup(this.buttons.buttongroup);
    sc.menu.pushBackCallback(this.onBackButtonPress);
    sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.HIDDEN);
  },

  hideMenu() {
    this.removeObservers();
    sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.LARGE);
    sc.menu.buttonInteract.removeButtonGroup(this.buttons.buttongroup);
  },

  addObservers() {
    sc.Model.addObserver(sc.menu, this);
  },

  removeObservers() {
    sc.Model.removeObserver(sc.menu, this);
  },

  onBackButtonPress() {
    sc.menu.popBackCallback();
    sc.menu.popMenu();
  },

  onBeginButtonPress() {
    // Clear the background audio and transition to the game
    ig.bgm.clear('MEDIUM_OUT');
    ig.game.start(sc.START_MODE.EXPLORE, 1);
    ig.game.setPaused(false);

    ig.interact.removeEntry(titleScreenButtonGuiInstance.buttonInteract)
  },

  onGitButtonPress() {
    // Open the GitHub page in the default browser
    nw.Shell.openExternal('https://github.com/lexisother/CCProjectRed/issues');
  },

  // Stub
  modelChanged(..._args: unknown[]) {},
});

// @ts-expect-error It doesn't dd*actually* exist in-game, so we have to assign it.
sc.MENU_SUBMENU.EXPLORE = Math.max(...Object.values(sc.MENU_SUBMENU)) + 1;
sc.SUB_MENU_INFO[sc.MENU_SUBMENU.EXPLORE] = {
  Clazz: sc.ExploreMenu,
  name: 'project-red',
};
